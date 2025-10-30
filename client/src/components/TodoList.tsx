import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTodoSchema, type Todo, type InsertTodo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, CheckSquare } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  compact?: boolean;
}

export function TodoList({ todos, isLoading, compact = false }: TodoListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<InsertTodo>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      task: "",
      completed: false,
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: InsertTodo) => apiRequest("POST", "/api/todo", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todo"] });
      toast({
        title: "Task added!",
        description: "Your task has been added to the list.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/todo/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todo"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
      setDeletingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      setDeletingId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      apiRequest("POST", `/api/todo/${id}/toggle`, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todo"] });
    },
  });

  const onSubmit = (data: InsertTodo) => {
    addMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {!compact && (
          <div className="animate-pulse">
            <div className="h-9 rounded-md bg-muted" />
          </div>
        )}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-4 w-4 rounded bg-muted" />
              <div className="h-4 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!compact && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Add a new task..."
                      {...field}
                      data-testid="input-todo"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={addMutation.isPending}
              data-testid="button-add-todo"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      )}

      <div className={`space-y-2 ${compact ? "max-h-[300px] overflow-y-auto" : ""}`}>
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CheckSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium">No tasks yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first task to get started
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-3 rounded-lg border p-3 hover-elevate"
              data-testid={`todo-${todo.id}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggle(todo.id, todo.completed)}
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span
                className={`flex-1 ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                data-testid={`todo-text-${todo.id}`}
              >
                {todo.task}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(todo.id)}
                disabled={deletingId === todo.id}
                className="opacity-0 group-hover:opacity-100"
                data-testid={`button-delete-todo-${todo.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
