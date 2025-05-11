"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BoardType, ListType, TaskType } from "@/lib/types";
import { mockLists, mockTasks } from "@/lib/mock-data";
import { ListContainer } from "@/components/boards/list-container";
import { CreateListDialog } from "@/components/boards/create-list-dialog";
import { BoardHeader } from "@/components/boards/board-header";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import { ActivitySidebar } from "@/components/boards/activity-sidebar";
import { Plus } from "lucide-react";

interface BoardClientProps {
  board: BoardType;
  boardId: string;
}

export function BoardClient({ board, boardId }: BoardClientProps) {
  const { toast } = useToast();

  const [lists, setLists] = useState<ListType[]>([]);
  const [tasks, setTasks] = useState<Record<string, TaskType[]>>({});
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const boardLists = mockLists[boardId] || [];
    const boardTasks: Record<string, TaskType[]> = {};
    
    boardLists.forEach((list) => {
      boardTasks[list.id] = mockTasks[list.id] || [];
    });
    
    setLists(boardLists);
    setTasks(boardTasks);
  }, [boardId]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    if (type === "list") {
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);
      
      const updatedLists = newLists.map((list, index) => ({
        ...list,
        order: index,
      }));
      
      setLists(updatedLists);
      toast({
        description: `List "${removed.title}" moved successfully`,
      });
      return;
    }
    
    if (type === "task") {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;
      
      if (sourceListId === destListId) {
        const listTasks = Array.from(tasks[sourceListId] || []);
        const [removed] = listTasks.splice(source.index, 1);
        listTasks.splice(destination.index, 0, removed);
        
        const updatedTasks = listTasks.map((task, index) => ({
          ...task,
          order: index,
        }));
        
        setTasks({
          ...tasks,
          [sourceListId]: updatedTasks,
        });
      } else {
        const sourceListTasks = Array.from(tasks[sourceListId] || []);
        const destListTasks = Array.from(tasks[destListId] || []);
        
        const [removed] = sourceListTasks.splice(source.index, 1);
        
        const updatedTask = {
          ...removed,
          listId: destListId,
        };
        
        destListTasks.splice(destination.index, 0, updatedTask);
        
        const updatedSourceTasks = sourceListTasks.map((task, index) => ({
          ...task,
          order: index,
        }));
        
        const updatedDestTasks = destListTasks.map((task, index) => ({
          ...task,
          order: index,
        }));
        
        setTasks({
          ...tasks,
          [sourceListId]: updatedSourceTasks,
          [destListId]: updatedDestTasks,
        });
        
        const sourceList = lists.find((list) => list.id === sourceListId);
        const destList = lists.find((list) => list.id === destListId);
        
        toast({
          description: `Task moved from "${sourceList?.title}" to "${destList?.title}"`,
        });
      }
    }
  };

  const handleCreateList = (newList: ListType) => {
    setLists([...lists, newList]);
    setTasks({
      ...tasks,
      [newList.id]: [],
    });
    setIsCreateListOpen(false);
  };

  const handleCreateTask = (listId: string, newTask: TaskType) => {
    setTasks({
      ...tasks,
      [listId]: [...(tasks[listId] || []), newTask],
    });
  };

  const handleUpdateTask = (updatedTask: TaskType) => {
    const listId = updatedTask.listId;
    setTasks({
      ...tasks,
      [listId]: tasks[listId].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    });
    setSelectedTask(null);
  };

  return (
    <>
      <BoardHeader 
        board={board} 
        onToggleActivity={() => setShowSidebar(!showSidebar)} 
        showActivity={showSidebar}
      />
      
      <main 
        className="flex-1 overflow-x-auto pb-6"
        style={{
          backgroundColor: `${board.backgroundColor}20`
        }}
      >
        <div className="flex h-full">
          <div className={`flex-1 transition-all ${showSidebar ? 'pr-[300px]' : ''}`}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="px-4 py-4 flex gap-4 items-start h-full">
                {lists
                  .sort((a, b) => a.order - b.order)
                  .map((list, index) => (
                    <ListContainer
                      key={list.id}
                      list={list}
                      tasks={tasks[list.id] || []}
                      index={index}
                      onCreateTask={handleCreateTask}
                      onSelectTask={setSelectedTask}
                    />
                  ))}
                
                <div className="shrink-0 w-72">
                  <Button
                    variant="outline"
                    className="h-10 p-2 w-full justify-start bg-background/80 hover:bg-background"
                    onClick={() => setIsCreateListOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add another list
                  </Button>
                </div>
              </div>
            </DragDropContext>
          </div>
          
          {showSidebar && (
            <ActivitySidebar 
              boardId={boardId} 
              onClose={() => setShowSidebar(false)} 
            />
          )}
        </div>
      </main>
      
      {isCreateListOpen && (
        <CreateListDialog
          boardId={boardId}
          isOpen={isCreateListOpen}
          onClose={() => setIsCreateListOpen(false)}
          onCreateList={handleCreateList}
          listOrder={lists.length}
        />
      )}
      
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </>
  );
}