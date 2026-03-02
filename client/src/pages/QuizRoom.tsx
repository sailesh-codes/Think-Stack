import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Copy, Trophy, Clock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  score: number;
  hasAnswered: boolean;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizRoom() {
  const { user } = useAuth();
  const { quizId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const isCreator = urlParams.get("creator") === user?.id;
  
  const [quiz, setQuiz] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;
      try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (response.ok) {
          const quizData = await response.json();
          console.log('Quiz data loaded:', quizData);
          
          // Check if questions need transformation
          let transformedQuiz = quizData;
          if (quizData.questions && quizData.questions.length > 0) {
            const firstQuestion = quizData.questions[0];
            
            // Check if questions are in the old format (questionText instead of question)
            if (firstQuestion.questionText && !firstQuestion.question) {
              console.log('Transforming quiz data format...');
              transformedQuiz = {
                ...quizData,
                questions: quizData.questions.map((q: any) => ({
                  ...q,
                  question: q.questionText,
                  correctAnswer: q.options.indexOf(q.correctAnswer)
                }))
              };
            }
          }
          
          console.log('Final quiz data:', transformedQuiz);
          setQuiz(transformedQuiz);
        } else {
          console.error("Quiz not found");
        }
      } catch (error) {
        console.error("Failed to load quiz:", error);
      }
    };
    loadQuiz();
  }, [quizId]);

  // Simulate WebSocket for real-time updates
  useEffect(() => {
    if (!quiz) return;

    // If user is not authenticated and hasn't joined, don't simulate players
    if (!user && !hasJoined) return;

    // Simulate players joining
    const simulatedPlayers: Player[] = [
      { id: "1", name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() || "You" : playerName || "Player 1", score: 0, hasAnswered: false },
      { id: "2", name: "Player 2", score: 0, hasAnswered: false },
      { id: "3", name: "Player 3", score: 0, hasAnswered: false },
    ];
    setPlayers(simulatedPlayers);
  }, [quiz, user, hasJoined, playerName]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && !showResults && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameStarted, showResults, timeLeft]);

  const handleTimeUp = () => {
    setShowCorrectAnswer(true);
    setTimeout(() => {
      if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowCorrectAnswer(false);
        setTimeLeft(30);
      } else {
        setShowResults(true);
      }
    }, 3000);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || showCorrectAnswer) return;
    
    setSelectedAnswer(answerIndex);
    
    // Update player score
    setPlayers(prev => prev.map(p => 
      p.id === "1" 
        ? { ...p, hasAnswered: true, score: answerIndex === quiz.questions[currentQuestion].correctAnswer ? p.score + 10 : p.score }
        : { ...p, hasAnswered: true, score: Math.random() > 0.5 ? p.score + 10 : p.score }
    ));
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/quiz-room/${quizId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard! Share this link with players to join the quiz.");
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => b.score - a.score);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Debug log - check quiz structure
  console.log('Quiz state:', quiz);
  console.log('Current question:', currentQuestion);
  console.log('Questions length:', quiz.questions?.length);
  console.log('First question:', quiz.questions?.[0]);
  
  // Add a fallback for when game hasn't started
  if (!gameStarted && !isCreator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Waiting for game to start...</h2>
              <p className="text-muted-foreground">The quiz creator will start the game soon</p>
              
              {/* Debug: Show quiz info */}
              {quiz && (
                <div className="mt-6 p-4 bg-orange-100 dark:bg-orange-800/30 rounded-lg text-left">
                  <p className="font-semibold">Quiz Debug Info:</p>
                  <p>Title: {quiz.title}</p>
                  <p>Questions: {quiz.questions?.length || 0}</p>
                  <p>Topic: {quiz.topic}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here are the final results</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Final Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getSortedPlayers().map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" :
                        index === 1 ? "bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800" :
                        index === 2 ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800" :
                        "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <span className="text-lg font-bold">{player.score} pts</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Game Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span className="font-bold">{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants</span>
                    <span className="font-bold">{players.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Score</span>
                    <span className="font-bold">{players.find(p => p.id === "1")?.score || 0} pts</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={() => window.location.href = "/quiz"}>
                  Create New Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">
              {gameStarted ? `Question ${currentQuestion + 1} of ${quiz.questions.length}` : "Waiting to start..."}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>{players.length}/10 players</span>
            </div>
            
            {isCreator && !gameStarted && (
              <Button onClick={copyInviteLink} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
        </div>

        {/* Players List (Creator View) */}
        {isCreator && !gameStarted && (
          <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Players in Room</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {players.map((player) => (
                  <div key={player.id} className="text-center p-3 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium truncate">{player.name}</p>
                  </div>
                ))}
              </div>
              
              {players.length >= 2 && (
                <Button onClick={handleStartGame} className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Start Game
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Question */}
        {gameStarted && quiz.questions && quiz.questions[currentQuestion] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Timer */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                timeLeft <= 10 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
              }`}>
                <Clock className="h-4 w-4" />
                {timeLeft}s
              </div>
            </div>

            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {quiz.questions[currentQuestion].question}
                </h2>
                
                <div className="grid gap-3">
                  {quiz.questions[currentQuestion].options.map((option: string, index: number) => {
                    const isCorrect = index === quiz.questions[currentQuestion].correctAnswer;
                    const isSelected = index === selectedAnswer;
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null || showCorrectAnswer}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          showCorrectAnswer && isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : showCorrectAnswer && isSelected && !isCorrect
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : isSelected
                            ? "border-orange-500 bg-orange-100 dark:bg-orange-800/30"
                            : "border-orange-200 hover:border-orange-400 bg-white dark:bg-orange-950/50"
                        } ${selectedAnswer !== null || showCorrectAnswer ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrectAnswer && isCorrect && (
                            <Trophy className="h-5 w-5 text-green-500" />
                          )}
                          {showCorrectAnswer && isSelected && !isCorrect && (
                            <span className="text-red-500 text-sm">✗</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Scores */}
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
              <CardHeader>
                <CardTitle className="text-lg">Live Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getSortedPlayers().map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-orange-100 dark:bg-orange-800/30 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span>{player.name}</span>
                        {player.hasAnswered && <span className="text-xs text-green-500">✓</span>}
                      </div>
                      <span className="font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Waiting for players or join screen */}
        {!gameStarted && !isCreator && !user && (
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Join Live Quiz</h2>
              <p className="text-muted-foreground mb-6">Enter your name to join this quiz session</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 border border-orange-200 rounded-lg bg-white dark:bg-orange-950/50"
                  maxLength={20}
                />
                <Button 
                  onClick={() => setHasJoined(true)}
                  disabled={!playerName.trim() || players.length >= 10}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {players.length >= 10 ? "Room Full" : "Join Quiz"}
                </Button>
              </div>
              
              {players.length >= 10 && (
                <p className="text-sm text-destructive mt-2">
                  This quiz room is full (10/10 players). Please contact the quiz creator to upgrade for more participants.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {!gameStarted && !isCreator && user && !hasJoined && (
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Join Live Quiz</h2>
              <p className="text-muted-foreground mb-6">Click below to join this quiz session</p>
              
              <Button 
                onClick={() => setHasJoined(true)}
                disabled={players.length >= 10}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {players.length >= 10 ? "Room Full" : "Join Quiz"}
              </Button>
              
              {players.length >= 10 && (
                <p className="text-sm text-destructive mt-2">
                  This quiz room is full (10/10 players). Please contact the quiz creator to upgrade for more participants.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {!gameStarted && !isCreator && hasJoined && (
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Joined Successfully!</h2>
              <p className="text-muted-foreground">Waiting for the quiz creator to start the game...</p>
              <div className="mt-4 text-sm">
                Players in room: {players.length}/10
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
