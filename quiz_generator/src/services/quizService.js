import openai from './openaiClient';

/**
 * Generates a quiz using OpenAI API based on topic and difficulty.
 * @param {string} topic - The quiz topic (e.g., "Science", "History")
 * @param {string} difficulty - The difficulty level (Easy, Medium, Hard, Expert)
 * @returns {Promise<object>} Generated quiz data
 */
export async function generateQuizWithOpenAI(topic, difficulty) {
  try {
    // Check if OpenAI client is properly configured
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const questionsCount = getQuestionCount(difficulty);
    const timeLimit = getTimeLimit(difficulty);
    
    const systemPrompt = `You are an expert quiz generator. Create educational quizzes that are engaging, accurate, and appropriate for the specified difficulty level. 
    Focus on creating clear, unambiguous questions with well-balanced multiple choice options.`;
    
    const userPrompt = `Generate a ${difficulty.toLowerCase()} level quiz about "${topic}" with exactly ${questionsCount} multiple choice questions. 
    Each question should have 4 options with only one correct answer. 
    Include a brief explanation for each correct answer.
    Make sure questions are educational, factual, and appropriate for the ${difficulty.toLowerCase()} difficulty level.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'quiz_generation_response',
          schema: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: { type: 'string' },
                    options: { 
                      type: 'array',
                      items: { type: 'string' },
                      minItems: 4,
                      maxItems: 4
                    },
                    correctAnswer: { type: 'number' },
                    explanation: { type: 'string' }
                  },
                  required: ['question', 'options', 'correctAnswer', 'explanation'],
                  additionalProperties: false
                }
              }
            },
            required: ['questions'],
            additionalProperties: false
          }
        }
      },
      temperature: 0.7,
      max_tokens: 4000
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);
    
    // Validate the response structure
    if (!aiResponse.questions || !Array.isArray(aiResponse.questions) || aiResponse.questions.length === 0) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Format the response to match expected structure
    const quizData = {
      id: 'quiz_' + Date.now(),
      topic: topic,
      difficulty: difficulty,
      questions: aiResponse.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      })),
      timeLimit: timeLimit,
      createdAt: new Date().toISOString()
    };

    return quizData;
    
  } catch (error) {
    console.error('Error generating quiz with OpenAI:', error);
    
    // More specific error handling
    if (error.message?.includes('API key')) {
      throw new Error('API key configuration error: ' + error.message);
    } else if (error.message?.includes('quota')) {
      throw new Error('OpenAI API quota exceeded: ' + error.message);
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    
    // Fallback to mock data in case of API failure
    console.log('Falling back to sample quiz data...');
    return generateFallbackQuiz(topic, difficulty);
  }
}

/**
 * Gets the number of questions based on difficulty level.
 * @param {string} difficulty - The difficulty level
 * @returns {number} Number of questions
 */
function getQuestionCount(difficulty) {
  switch (difficulty) {
    case 'Easy': return 5;
    case 'Medium': return 10;
    case 'Hard': return 15;
    case 'Expert': return 20;
    default: return 10;
  }
}

/**
 * Gets the time limit in seconds based on difficulty level.
 * @param {string} difficulty - The difficulty level
 * @returns {number} Time limit in seconds
 */
function getTimeLimit(difficulty) {
  switch (difficulty) {
    case 'Easy': return 300; // 5 minutes
    case 'Medium': return 600; // 10 minutes
    case 'Hard': return 900; // 15 minutes
    case 'Expert': return 1200; // 20 minutes
    default: return 600;
  }
}

/**
 * Generates fallback quiz data when OpenAI API fails.
 * @param {string} topic - The quiz topic
 * @param {string} difficulty - The difficulty level
 * @returns {object} Fallback quiz data
 */
function generateFallbackQuiz(topic, difficulty) {
  const fallbackQuestions = [
    {
      id: 1,
      question: `What is a key concept related to ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: `This is a basic question about ${topic}. We're experiencing technical difficulties, so this is a sample question.`
    },
    {
      id: 2,
      question: `Which of the following is associated with ${topic}?`,
      options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      correctAnswer: 1,
      explanation: `This relates to ${topic}. This is a fallback question while we resolve technical issues.`
    }
  ];

  return {
    id: 'fallback_quiz_' + Date.now(),
    topic: topic,
    difficulty: difficulty,
    questions: fallbackQuestions.slice(0, Math.min(2, getQuestionCount(difficulty))),
    timeLimit: getTimeLimit(difficulty),
    createdAt: new Date().toISOString(),
    isFallback: true
  };
}

/**
 * Validates if a topic is appropriate for quiz generation.
 * @param {string} topic - The topic to validate
 * @returns {boolean} Whether the topic is valid
 */
export function isValidTopic(topic) {
  if (!topic || typeof topic !== 'string') return false;
  
  const trimmedTopic = topic.trim();
  if (trimmedTopic.length < 2 || trimmedTopic.length > 100) return false;
  
  // Basic check for inappropriate content (could be enhanced)
  const inappropriatePatterns = [
    /\b(explicit|adult|nsfw|sexual|violent)\b/i,
    /\b(illegal|harmful|dangerous)\b/i
  ];
  
  return !inappropriatePatterns.some(pattern => pattern.test(trimmedTopic));
}

/**
 * Moderates quiz content using OpenAI moderation API.
 * @param {string} content - Content to moderate
 * @returns {Promise<boolean>} Whether content is safe
 */
export async function moderateContent(content) {
  try {
    const response = await openai.moderations.create({
      model: 'text-moderation-latest',
      input: content
    });
    
    return !response.results[0].flagged;
  } catch (error) {
    console.error('Error moderating content:', error);
    // If moderation fails, allow content but log the error
    return true;
  }
}