"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityType } from "@/lib/types";
import { mockActivities } from "@/lib/mock-data";

interface ActivitySidebarProps {
  boardId: string;
  onClose: () => void;
}

export function ActivitySidebar({ boardId, onClose }: ActivitySidebarProps) {
  const [activities, setActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    const boardActivities = mockActivities[boardId] || [];
    setActivities(boardActivities);
  }, [boardId]);

  return (
    <div className="fixed top-[104px] right-0 h-[calc(100vh-104px)] w-[300px] bg-background border-l z-30">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Activity</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-57px)]">
        <div className="p-4">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.image} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      {activity.action} {activity.entity}{" "}
                      <span className="font-medium">"{activity.entityTitle}"</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activity yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}