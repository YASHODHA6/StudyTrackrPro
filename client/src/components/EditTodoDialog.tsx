import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTodoSchema, type Todo, type InsertTodo } from "@shared/schema";
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

interface EditTodoDialogProps {
  todo: Todo;
}

export function EditTodoDialog({ todo }: EditTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertTodo>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      task: todo.task,
      completed: todo.completed,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<InsertTodo>) => apiRequest("PUT", `/api/todo/${todo.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todo"] });
      toast({
        title: "Task updated!",
        description: "Your changes have been saved successfully.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTodo) => {
    mutation.mutate({ task: data.task });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="opacity-0 group-hover:opacity-100"
        data-testid={`button-edit-todo-${todo.id}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update your task description
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter task description"
                        {...field}
                        data-testid="input-edit-task"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  data-testid="button-save-todo"
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
