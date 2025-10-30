import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudySession } from "@shared/schema";

interface StudyHoursChartProps {
  sessions: StudySession[];
  isLoading: boolean;
}

export function StudyHoursChart({ sessions, isLoading }: StudyHoursChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Hours by Subject</CardTitle>
          <CardDescription>Total hours spent on each subject</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] animate-pulse">
          <div className="h-full w-full rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const subjectData = sessions.reduce((acc, session) => {
    const subject = session.subject;
    if (!acc[subject]) {
      acc[subject] = 0;
    }
    acc[subject] += session.hours;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(subjectData)
    .map(([subject, hours]) => ({
      subject: subject.length > 15 ? subject.substring(0, 15) + "..." : subject,
      hours: Math.round(hours * 10) / 10,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Hours by Subject</CardTitle>
          <CardDescription>Total hours spent on each subject</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No study sessions yet. Add your first session to see the chart!</p>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card data-testid="chart-study-hours">
      <CardHeader>
        <CardTitle>Study Hours by Subject</CardTitle>
        <CardDescription>Total hours spent on each subject (top 10)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="subject"
              angle={-45}
              textAnchor="end"
              height={80}
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
            <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
