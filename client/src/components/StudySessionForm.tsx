import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertStudySessionSchema, type InsertStudySession } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";

export function StudySessionForm() {
  const { toast } = useToast();

  const form = useForm<InsertStudySession>({
    resolver: zodResolver(insertStudySessionSchema),
    defaultValues: {
      subject: "",
      hours: 1,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertStudySession) => apiRequest("POST", "/api/study", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Study session added!",
        description: "Your study time has been recorded successfully.",
      });
      form.reset({
        subject: "",
        hours: 1,
        date: new Date().toISOString().split("T")[0],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add study session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStudySession) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mathematics, History"
                  {...field}
                  data-testid="input-subject"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours Studied</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    placeholder="1.5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    data-testid="input-hours"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={mutation.isPending}
          data-testid="button-add-session"
        >
          {mutation.isPending ? (
            "Adding..."
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Study Session
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
