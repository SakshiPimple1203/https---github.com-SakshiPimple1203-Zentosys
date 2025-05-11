"use client";

import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { MoreHorizontal, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListType, TaskType } from "@/lib/types";
import { TaskCard } from "@/components/tasks/task-card";

interface ListContainerProps {
  list: ListType;
  tasks: TaskType[];
  index: number;
  onCreateTask: (listId: string, task: TaskType) => void;
  onSelectTask: (task: TaskType) => void;
}

export function ListContainer({
  list,
  tasks,
  index,
  onCreateTask,
  onSelectTask,
}: ListContainerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: TaskType = {
      id: Date.now().toString(),
      listId: list.id,
      boardId: list.boardId,
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      labels: [],
      order: tasks.length,
      createdBy: "1", // Use the current user's ID in a real app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateTask(list.id, newTask);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAddingTask(false);
  };

  const handleTitleSave = () => {
    // In a real app, save the updated title to the server
    setIsEditingTitle(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <Draggable draggableId={`list-${list.id}`} index={index} type="list">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shrink-0 w-72"
        >
          <Card className="bg-muted/80 rounded-md shadow-sm">
            <div
              className="p-2 flex items-center justify-between rounded-t-md"
              {...provided.dragHandleProps}
            >
              {isEditingTitle ? (
                <div className="flex-1 px-1">
                  <Input
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSave();
                      if (e.key === "Escape") {
                        setListTitle(list.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="h-7 bg-background"
                    autoFocus
                  />
                </div>
              ) : (
                <h3
                  className="font-medium text-sm px-1 py-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {listTitle}
                </h3>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>List actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    Rename list
                  </DropdownMenuItem>
                  <DropdownMenuItem>Clear list</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete list
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Droppable droppableId={list.id} type="task">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-2 min-h-[20px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-accent/50" : ""
                  }`}
                  style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
                >
                  {sortedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onClick={() => onSelectTask(task)}
                    />
                  ))}
                  {provided.placeholder}

                  {isAddingTask ? (
                    <div className="mt-2 space-y-2">
                      <Card className="p-2 bg-background">
                        <Textarea
                          placeholder="Enter task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="min-h-[40px] resize-none"
                          autoFocus
                        />
                        <Textarea
                          placeholder="Add a description... (optional)"
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          className="min-h-[40px] resize-none mt-2"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={handleAddTask}
                            disabled={!newTaskTitle.trim()}
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingTask(false);
                              setNewTaskTitle("");
                              setNewTaskDescription("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
                      onClick={() => setIsAddingTask(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add a card
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          </Card>
        </div>
      )}
    </Draggable>
  );
}