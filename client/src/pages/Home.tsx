import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckSquare, MessageSquare, FileDown, BarChart3 } from "lucide-react";
import { StudySessionForm } from "@/components/StudySessionForm";
import { StudySessionList } from "@/components/StudySessionList";
import { TodoList } from "@/components/TodoList";
import { FeedbackForm } from "@/components/FeedbackForm";
import { StatsCards } from "@/components/StatsCards";
import type { StudySession, Todo, StudyStats } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: studySessions = [], isLoading: loadingSessions } = useQuery<StudySession[]>({
    queryKey: ["/api/study"],
  });

  const { data: todos = [], isLoading: loadingTodos } = useQuery<Todo[]>({
    queryKey: ["/api/todo"],
  });

  const { data: stats, isLoading: loadingStats } = useQuery<StudyStats>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Study Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your study sessions and boost productivity</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid" data-testid="navigation-tabs">
            <TabsTrigger value="dashboard" className="gap-2" data-testid="tab-dashboard">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="study" className="gap-2" data-testid="tab-study">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Study</span>
            </TabsTrigger>
            <TabsTrigger value="todos" className="gap-2" data-testid="tab-todos">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Todos</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2" data-testid="tab-feedback">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2" data-testid="tab-report">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards stats={stats} isLoading={loadingStats} />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Study Sessions</CardTitle>
                  <CardDescription>Your latest study activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudySessionList sessions={studySessions.slice(0, 5)} isLoading={loadingSessions} compact />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Things you need to do</CardDescription>
                </CardHeader>
                <CardContent>
                  <TodoList todos={todos.filter(t => !t.completed).slice(0, 5)} isLoading={loadingTodos} compact />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add Study Session</CardTitle>
                  <CardDescription>Record your study time</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudySessionForm />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study History</CardTitle>
                  <CardDescription>All your study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudySessionList sessions={studySessions} isLoading={loadingSessions} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="todos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Organize your study tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <TodoList todos={todos} isLoading={loadingTodos} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Send Feedback</CardTitle>
                <CardDescription>Help us improve your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Download Study Report</CardTitle>
                <CardDescription>Export your study data with optional date filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Date Range (Optional)</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Start Date</label>
                      <input
                        type="date"
                        id="report-start-date"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        data-testid="input-report-start-date"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">End Date</label>
                      <input
                        type="date"
                        id="report-end-date"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        data-testid="input-report-end-date"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Export Format</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <button
                      onClick={() => {
                        const startDate = (document.getElementById('report-start-date') as HTMLInputElement)?.value;
                        const endDate = (document.getElementById('report-end-date') as HTMLInputElement)?.value;
                        let url = '/api/report?format=json';
                        if (startDate) url += `&startDate=${startDate}`;
                        if (endDate) url += `&endDate=${endDate}`;
                        window.location.href = url;
                      }}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover-elevate active-elevate-2"
                      data-testid="button-download-json"
                    >
                      <FileDown className="h-4 w-4" />
                      JSON
                    </button>
                    <button
                      onClick={() => {
                        const startDate = (document.getElementById('report-start-date') as HTMLInputElement)?.value;
                        const endDate = (document.getElementById('report-end-date') as HTMLInputElement)?.value;
                        let url = '/api/report?format=txt';
                        if (startDate) url += `&startDate=${startDate}`;
                        if (endDate) url += `&endDate=${endDate}`;
                        window.location.href = url;
                      }}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground hover-elevate active-elevate-2"
                      data-testid="button-download-txt"
                    >
                      <FileDown className="h-4 w-4" />
                      TXT
                    </button>
                    <button
                      onClick={() => {
                        const startDate = (document.getElementById('report-start-date') as HTMLInputElement)?.value;
                        const endDate = (document.getElementById('report-end-date') as HTMLInputElement)?.value;
                        let url = '/api/report?format=csv';
                        if (startDate) url += `&startDate=${startDate}`;
                        if (endDate) url += `&endDate=${endDate}`;
                        window.location.href = url;
                      }}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover-elevate active-elevate-2"
                      data-testid="button-download-csv"
                    >
                      <FileDown className="h-4 w-4" />
                      CSV
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Reports include all study sessions within the selected date range (or all sessions if no dates are selected).
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
