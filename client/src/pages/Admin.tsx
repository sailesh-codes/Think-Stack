import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Users, FileText, TrendingUp, Trash2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

interface AdminSummary {
  totalUsers: number;
  totalQuizzes: number;
  quizzesGeneratedToday: number;
  totalQuizzesGenerated: number;
  loginStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  newUserStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  userId: string;
  createdAt: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin emails for client-side protection
  const ADMIN_EMAILS = new Set([
    "codecraft2k@gmail.com",
    "thinkstack.ai.cc@gmail.com",
  ]);

  const isAdmin = user?.email ? ADMIN_EMAILS.has(user.email.toLowerCase()) : false;

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching admin data...');
        const [summaryRes, quizzesRes] = await Promise.all([
          fetch("/api/admin/summary", { credentials: "include" }),
          fetch("/api/admin/quizzes", { credentials: "include" }),
        ]);

        console.log('Summary response status:', summaryRes.status);
        console.log('Quizzes response status:', quizzesRes.status);

        if (!summaryRes.ok || !quizzesRes.ok) {
          const errorText = await Promise.all([
            summaryRes.text(),
            quizzesRes.text()
          ]);
          console.error('API errors:', errorText);
          throw new Error(`Failed to fetch admin data: ${summaryRes.status}, ${quizzesRes.status}`);
        }

        const [summaryData, quizzesData] = await Promise.all([
          summaryRes.json(),
          quizzesRes.json(),
        ]);

        console.log('Summary data:', summaryData);
        console.log('Quizzes data:', quizzesData);

        setSummary(summaryData);
        setQuizzes(quizzesData);
      } catch (err) {
        console.error('Admin fetch error:', err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, setLocation]);

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    }
  };

  if (!isAdmin) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and view analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalQuizzes || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.quizzesGeneratedToday || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Time Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalQuizzesGenerated || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Login Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Login Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{summary?.loginStats?.today || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{summary?.loginStats?.thisWeek || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{summary?.loginStats?.thisMonth || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Year</p>
                  <p className="text-2xl font-bold">{summary?.loginStats?.thisYear || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                New User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{summary?.newUserStats?.today || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{summary?.newUserStats?.thisWeek || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{summary?.newUserStats?.thisMonth || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Year</p>
                  <p className="text-2xl font-bold">{summary?.newUserStats?.thisYear || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizzes.length === 0 ? (
                <p className="text-muted-foreground">No quizzes found</p>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.topic} • {quiz.difficulty} • {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteQuiz(quiz.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
