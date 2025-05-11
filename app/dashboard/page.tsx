"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { BoardCard } from "@/components/boards/board-card";
import { useAuth } from "@/components/providers/auth-provider";
import { BoardType } from "@/lib/types";
import { mockBoards } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setBoards(mockBoards);
  }, []);

  const handleCreateBoard = (newBoard: BoardType) => {
    setBoards([...boards, newBoard]);
    setIsCreateBoardOpen(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoards(boards.filter((board) => board.id !== boardId));
  };

  const handleUpdateBoard = (boardId: string, updatedBoard: Partial<BoardType>) => {
    setBoards(boards.map((board) => 
      board.id === boardId ? { ...board, ...updatedBoard } : board
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Boards</h1>
            <p className="text-muted-foreground">
              Manage and organize your projects
            </p>
          </div>
          <Button onClick={() => setIsCreateBoardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/40 text-center">
            <h3 className="text-xl font-medium mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create your first board to start organizing your projects and tasks.
            </p>
            <Button onClick={() => setIsCreateBoardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard 
                key={board.id} 
                board={board} 
                onDelete={handleDeleteBoard}
                onUpdate={handleUpdateBoard}
              />
            ))}
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:bg-muted/50 transition"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span>Create New Board</span>
            </button>
          </div>
        )}
      </main>

      <CreateBoardDialog
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
}