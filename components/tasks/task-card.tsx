import { Draggable } from "react-beautiful-dnd";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card } from "@/components/ui/card";
import { TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  task: TaskType;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const hasDueDate = !!task.dueDate;
  const isOverdue = hasDueDate && new Date(task.dueDate!) < new Date();
  
  const getDueDateText = () => {
    if (!hasDueDate) return "";
    return formatDistanceToNow(new Date(task.dueDate!), { addSuffix: true });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <Card
            className={cn(
              "p-3 bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              snapshot.isDragging && "shadow-lg"
            )}
            onClick={onClick}
          >
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.labels.map((label) => (
                  <div
                    key={label.id}
                    className="h-2 w-12 rounded-sm"
                    style={{ backgroundColor: label.color }}
                    title={label.name}
                  />
                ))}
              </div>
            )}
            <h4 className="font-medium text-sm mb-2">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {task.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-2">
                {hasDueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className={isOverdue ? "text-destructive font-medium" : ""}>
                      {getDueDateText()}
                    </span>
                  </div>
                )}
              </div>
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignedTo.slice(0, 3).map((user) => (
                    <Avatar key={user.id} className="h-5 w-5 border border-background">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-[8px]">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assignedTo.length > 3 && (
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[8px] border border-background">
                      +{task.assignedTo.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}