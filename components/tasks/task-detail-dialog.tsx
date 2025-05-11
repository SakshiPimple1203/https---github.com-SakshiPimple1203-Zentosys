"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Loader2,
  MoreHorizontal,
  Tag,
  User,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Label as TaskLabel, TaskType, User as UserType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskDetailDialogProps {
  task: TaskType;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: TaskType) => void;
}

export function TaskDetailDialog({
  task,
  isOpen,
  onClose,
  onUpdateTask,
}: TaskDetailDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [labels, setLabels] = useState<TaskLabel[]>(task.labels || []);
  const [assignedUsers, setAssignedUsers] = useState<UserType[]>(
    task.assignedTo || []
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Mock users for the demo
  const allUsers: UserType[] = [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  ];

  // Mock labels for the demo
  const allLabels: TaskLabel[] = [
    { id: "1", name: "Research", color: "#60A5FA" },
    { id: "2", name: "High Priority", color: "#F87171" },
    { id: "3", name: "Planning", color: "#34D399" },
    { id: "4", name: "Design", color: "#A78BFA" },
    { id: "5", name: "Meeting", color: "#FBBF24" },
    { id: "6", name: "Content", color: "#EC4899" },
  ];

  // Update task with current values
  const saveTask = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be a PUT/PATCH request to your API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const updatedTask: TaskType = {
        ...task,
        title,
        description: description || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        labels,
        assignedTo: assignedUsers,
        updatedAt: new Date().toISOString(),
      };
      
      onUpdateTask(updatedTask);
      toast({
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "There was an error updating the task.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle label toggle
  const toggleLabel = (label: TaskLabel) => {
    const exists = labels.some((l) => l.id === label.id);
    if (exists) {
      setLabels(labels.filter((l) => l.id !== label.id));
    } else {
      setLabels([...labels, label]);
    }
  };

  // Handle user assignment toggle
  const toggleAssignUser = (user: UserType) => {
    const exists = assignedUsers.some((u) => u.id === user.id);
    if (exists) {
      setAssignedUsers(assignedUsers.filter((u) => u.id !== user.id));
    } else {
      setAssignedUsers([...assignedUsers, user]);
    }
  };

  // Save when dialog is closed
  useEffect(() => {
    if (!isOpen && (title !== task.title || description !== (task.description || "") || 
        dueDate !== (task.dueDate ? new Date(task.dueDate) : undefined))) {
      saveTask();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold mb-2"
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingTitle(false);
                    if (e.key === "Escape") {
                      setTitle(task.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <DialogTitle
                  className="text-xl cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </DialogTitle>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  Edit title
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsEditingDescription(true)}
                >
                  Edit description
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="col-span-2 space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <Label className="text-sm font-medium">Description</Label>
              </div>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsEditingDescription(false);
                        saveTask();
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDescription(task.description || "");
                        setIsEditingDescription(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : description ? (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors"
                >
                  {description}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingDescription(true)}
                  className="text-muted-foreground w-full justify-start"
                >
                  Add a more detailed description...
                </Button>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Activity</Label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
                      alt="Demo User"
                    />
                    <AvatarFallback>DU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Demo User</p>
                      <p className="text-sm">Created this task.</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Add to card</h4>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <User className="h-4 w-4 mr-2" /> Members
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      {allUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                            assignedUsers.some((u) => u.id === user.id)
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => toggleAssignUser(user)}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Tag className="h-4 w-4 mr-2" /> Labels
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      {allLabels.map((label) => (
                        <div
                          key={label.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                            labels.some((l) => l.id === label.id)
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => toggleLabel(label)}
                        >
                          <div
                            className="h-4 w-4 rounded-sm"
                            style={{ backgroundColor: label.color }}
                          />
                          <span className="text-sm">{label.name}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Calendar className="h-4 w-4 mr-2" /> Due date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <div className="flex justify-between">
                        {dueDate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDueDate(undefined)}
                          >
                            Remove
                          </Button>
                        )}
                        <Button size="sm" onClick={() => saveTask()}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Labels</h4>
              {labels.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {labels.map((label) => (
                    <Badge
                      key={label.id}
                      className="flex items-center gap-1"
                      style={{
                        backgroundColor: label.color,
                        color: "white",
                      }}
                    >
                      {label.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLabel(label);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No labels</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Members</h4>
              {assignedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {assignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center bg-muted p-1 rounded-md"
                    >
                      <Avatar className="h-6 w-6 mr-1">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs mr-1">{user.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleAssignUser(user)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No members</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Due Date</h4>
              {dueDate ? (
                <div className="flex items-center">
                  <Badge
                    variant={
                      dueDate < new Date() ? "destructive" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {format(dueDate, "MMM d, yyyy")}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => setDueDate(undefined)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No due date</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Actions</h4>
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={saveTask}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}