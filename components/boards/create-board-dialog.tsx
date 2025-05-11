"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BoardType } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Board title must be at least 2 characters",
  }),
  visibility: z.enum(["private", "public", "team"], {
    required_error: "Please select a visibility option",
  }),
  backgroundColor: z.string().optional(),
});

type CreateBoardProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: BoardType) => void;
};

export function CreateBoardDialog({
  isOpen,
  onClose,
  onCreateBoard,
}: CreateBoardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      visibility: "private",
      backgroundColor: "#3B82F6",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be a POST request to your API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newBoard: BoardType = {
        id: Date.now().toString(),
        title: values.title,
        backgroundColor: values.backgroundColor || "#3B82F6",
        visibility: values.visibility,
        members: [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: "admin",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onCreateBoard(newBoard);
      toast({
        title: "Board created",
        description: `${values.title} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to create board",
        description: "There was an error creating your board.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const colorOptions = [
    { value: "#3B82F6", label: "Blue" },
    { value: "#10B981", label: "Green" },
    { value: "#F97316", label: "Orange" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#EF4444", label: "Red" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
          <DialogDescription>
            Add a new board to organize your tasks and projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My New Project" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your board a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Private - Only you</SelectItem>
                      <SelectItem value="team">Team - Selected members</SelectItem>
                      <SelectItem value="public">Public - Anyone with the link</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Control who can see and edit this board.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Board"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}