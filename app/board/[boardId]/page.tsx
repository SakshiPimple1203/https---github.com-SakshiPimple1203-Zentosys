import { Navbar } from "@/components/layout/navbar";
import { BoardClient } from "@/components/boards/board-client";
import { mockBoards } from "@/lib/mock-data";

export async function generateStaticParams() {
  return mockBoards.map((board) => ({
    boardId: board.id,
  }));
}

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const board = mockBoards.find((b) => b.id === params.boardId);

  if (!board) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <p>Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <BoardClient board={board} boardId={params.boardId} />
    </div>
  );
}