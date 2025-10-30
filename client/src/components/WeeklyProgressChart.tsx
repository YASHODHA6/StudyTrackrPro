import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudySession } from "@shared/schema";
import { format, startOfWeek, subWeeks } from "date-fns";

interface WeeklyProgressChartProps {
  sessions: StudySession[];
  isLoading: boolean;
}

export function WeeklyProgressChart({ sessions, isLoading }: WeeklyProgressChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Progress</CardTitle>
          <CardDescription>Study hours over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] animate-pulse">
          <div className="h-full w-full rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const today = new Date();
  const weeks: Record<string, number> = {};

  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
    const weekLabel = format(weekStart, "MMM d");
    weeks[weekLabel] = 0;
  }

  sessions.forEach((session) => {
    const sessionDate = new Date(session.date);
    const weekStart = startOfWeek(sessionDate, { weekStartsOn: 1 });
    const weekLabel = format(weekStart, "MMM d");

    if (weekLabel in weeks) {
      weeks[weekLabel] += session.hours;
    }
  });

  const chartData = Object.entries(weeks).map(([week, hours]) => ({
    week,
    hours: Math.round(hours * 10) / 10,
  }));

  const hasData = chartData.some((d) => d.hours > 0);

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Progress</CardTitle>
          <CardDescription>Study hours over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No study sessions in the past 8 weeks. Start tracking to see your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="chart-weekly-progress">
      <CardHeader>
        <CardTitle>Weekly Study Progress</CardTitle>
        <CardDescription>Study hours over the past 8 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="week"
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
