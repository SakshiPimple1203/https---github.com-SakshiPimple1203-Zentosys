"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { ListType } from "@/lib/types";

interface CreateListDialogProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (list: ListType) => void;
  listOrder: number;
}

export function CreateListDialog({
  boardId,
  isOpen,
  onClose,
  onCreateList,
  listOrder,
}: CreateListDialogProps) {
  const [listTitle, setListTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateList = async () => {
    if (!listTitle.trim()) return;

    setIsLoading(true);
    try {
      // In a real app, this would be a POST request to your API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newList: ListType = {
        id: Date.now().toString(),
        boardId,
        title: listTitle,
        order: listOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onCreateList(newList);
      toast({
        description: `List "${listTitle}" created successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to create list",
        description: "There was an error creating your list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new list</DialogTitle>
          <DialogDescription>
            Add a new list to your board to organize tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="list-title" className="text-sm font-medium">
              List Title
            </label>
            <Input
              id="list-title"
              placeholder="e.g., To Do, In Progress, Done"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateList();
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateList}
            disabled={isLoading || !listTitle.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create List"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}