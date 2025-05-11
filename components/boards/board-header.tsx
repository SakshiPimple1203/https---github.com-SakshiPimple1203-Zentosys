import { Activity, Lock, Share, Users } from "lucide-react";
import { BoardType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BoardHeaderProps {
  board: BoardType;
  onToggleActivity: () => void;
  showActivity: boolean;
}

export function BoardHeader({ board, onToggleActivity, showActivity }: BoardHeaderProps) {
  return (
    <div className="sticky top-16 z-10 border-b bg-background">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{board.title}</h1>
            <Badge variant="outline" className="ml-2">
              {board.visibility === "private" ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              ) : board.visibility === "team" ? (
                <>
                  <Users className="h-3 w-3 mr-1" />
                  Team
                </>
              ) : (
                "Public"
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showActivity ? "default" : "outline"}
                    size="sm"
                    onClick={onToggleActivity}
                  >
                    <Activity className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Activity</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showActivity ? "Hide Activity" : "Show Activity"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Board</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="hidden md:flex -space-x-2 ml-2">
              {board.members.slice(0, 3).map((member) => (
                <TooltipProvider key={member.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{member.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {board.members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{board.members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}