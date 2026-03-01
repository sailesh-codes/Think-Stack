// Test quiz generation API
async function testQuizGeneration() {
  console.log('🧪 Testing Quiz Generation API...');
  
  try {
    // Test the quiz generation endpoint
    const response = await fetch('http://localhost:4000/api/quizzes/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'React Hooks and State',
        difficulty: 'easy',
        amount: 3
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const quiz = await response.json();
      console.log('✅ Quiz generated successfully!');
      console.log('Quiz ID:', quiz.id);
      console.log('Topic:', quiz.topic);
      console.log('Questions:', quiz.questions.length);
      console.log('First question:', quiz.questions[0]?.questionText || quiz.questions[0]?.question);
      console.log('First question options:', quiz.questions[0]?.options);
      console.log('Quiz URL:', `http://localhost:4000/quiz/${quiz.id}`);
      
      // Log the full structure of first question for debugging
      console.log('Full first question structure:', JSON.stringify(quiz.questions[0], null, 2));
    } else {
      const error = await response.text();
      console.log('❌ API Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testQuizGeneration();
