import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoardType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BoardCardProps {
  board: BoardType;
  onDelete?: (boardId: string) => void;
  onUpdate?: (boardId: string, updatedBoard: Partial<BoardType>) => void;
}

export function BoardCard({ board, onDelete, onUpdate }: BoardCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(board.title);
  const [shareEmail, setShareEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const formattedDate = formatDistanceToNow(new Date(board.updatedAt), {
    addSuffix: true,
  });

  const handleEdit = () => {
    if (onUpdate) {
      onUpdate(board.id, { title: editTitle });
      setIsEditDialogOpen(false);
      toast({
        description: "Board updated successfully",
      });
    }
  };

  const handleShare = () => {
    // In a real app, this would send an invitation to the email
    toast({
      description: `Invitation sent to ${shareEmail}`,
    });
    setShareEmail("");
    setIsShareDialogOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(board.id);
      toast({
        description: "Board deleted successfully",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer border">
        <Link href={`/board/${board.id}`}>
          <div
            className="h-24 w-full"
            style={{ backgroundColor: board.backgroundColor }}
          />
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-1">{board.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    setIsEditDialogOpen(true);
                  }}>
                    Edit board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    setIsShareDialogOpen(true);
                  }}>
                    Share board
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="text-xs">
              {board.visibility === "private"
                ? "Private board"
                : board.visibility === "team"
                ? "Team board"
                : "Public board"}
            </CardDescription>
          </CardHeader>
        </Link>
        <CardContent className="p-4 pt-0">
          <div className="text-xs text-muted-foreground">
            Updated {formattedDate}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex -space-x-2">
            {board.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {board.members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{board.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {board.members.length} {board.members.length === 1 ? "member" : "members"}
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>
              Make changes to your board here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Board Title
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Board</DialogTitle>
            <DialogDescription>
              Invite others to collaborate on this board.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this board? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}