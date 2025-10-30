import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertFeedbackSchema, type InsertFeedback } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, CheckCircle2 } from "lucide-react";

export function FeedbackForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertFeedback) => apiRequest("POST", "/api/feedback", data),
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve.",
      });
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFeedback) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your feedback has been received and will help us improve the platform.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  rows={6}
                  {...field}
                  data-testid="input-feedback"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={mutation.isPending}
          data-testid="button-submit-feedback"
        >
          {mutation.isPending ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Feedback
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
