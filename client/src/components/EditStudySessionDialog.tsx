import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertStudySessionSchema, type StudySession, type InsertStudySession } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil } from "lucide-react";

interface EditStudySessionDialogProps {
  session: StudySession;
}

export function EditStudySessionDialog({ session }: EditStudySessionDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertStudySession>({
    resolver: zodResolver(insertStudySessionSchema),
    defaultValues: {
      subject: session.subject,
      hours: session.hours,
      date: session.date,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertStudySession) => apiRequest("PUT", `/api/study/${session.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Study session updated!",
        description: "Your changes have been saved successfully.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStudySession) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        data-testid={`button-edit-session-${session.id}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Study Session</DialogTitle>
            <DialogDescription>
              Update your study session details
            </DialogDescription>
          </DialogHeader>

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
                        data-testid="input-edit-subject"
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
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          data-testid="input-edit-hours"
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
                        <Input type="date" {...field} data-testid="input-edit-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  data-testid="button-save-session"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
