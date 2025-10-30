import { useState } from "react";
import { BookOpen, Calendar, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import type { StudySession } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditStudySessionDialog } from "@/components/EditStudySessionDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface StudySessionListProps {
  sessions: StudySession[];
  isLoading: boolean;
  compact?: boolean;
}

export function StudySessionList({ sessions, isLoading, compact = false }: StudySessionListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/study/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Study session deleted",
        description: "The study session has been removed.",
      });
      setDeletingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete study session. Please try again.",
        variant: "destructive",
      });
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-medium">No study sessions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking your study time to see your progress
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${compact ? "max-h-[300px] overflow-y-auto" : ""}`}>
      {sessions.map((session) => (
        <div
          key={session.id}
          className="group flex items-center justify-between gap-4 rounded-lg border p-4 hover-elevate"
          data-testid={`session-${session.id}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium" data-testid={`session-subject-${session.id}`}>
                {session.subject}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(session.date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1" data-testid={`session-hours-${session.id}`}>
              <Clock className="h-3 w-3" />
              {session.hours}h
            </Badge>
            {!compact && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <EditStudySessionDialog session={session} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(session.id)}
                  disabled={deletingId === session.id}
                  data-testid={`button-delete-session-${session.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
