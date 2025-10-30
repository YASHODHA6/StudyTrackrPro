import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, TrendingUp } from "lucide-react";
import type { StudyStats } from "@shared/schema";

interface StatsCardsProps {
  stats: StudyStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-16 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Provide default values if stats is undefined
  const safeStats = stats || {
    totalHours: 0,
    numberOfSubjects: 0,
    averageHoursPerSubject: 0,
  };

  const statItems = [
    {
      label: "Total Study Hours",
      value: safeStats.totalHours.toFixed(1),
      icon: Clock,
      testId: "stat-total-hours",
    },
    {
      label: "Subjects Tracked",
      value: safeStats.numberOfSubjects.toString(),
      icon: BookOpen,
      testId: "stat-subjects",
    },
    {
      label: "Avg Hours/Subject",
      value: safeStats.averageHoursPerSubject.toFixed(1),
      icon: TrendingUp,
      testId: "stat-average",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statItems.map((stat) => (
        <Card key={stat.label} className="hover-elevate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-4xl font-bold tabular-nums" data-testid={stat.testId}>
                  {stat.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
