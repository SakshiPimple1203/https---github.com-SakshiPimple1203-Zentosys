export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type BoardMember = User & {
  role: "admin" | "editor" | "viewer";
};

export type BoardType = {
  id: string;
  title: string;
  backgroundColor: string;
  visibility: "private" | "public" | "team";
  members: BoardMember[];
  createdAt: string;
  updatedAt: string;
};

export type ListType = {
  id: string;
  boardId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type TaskType = {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description?: string;
  labels: Label[];
  assignedTo?: User[];
  dueDate?: string;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityType = {
  id: string;
  boardId: string;
  userId: string;
  user: User;
  action: string;
  entity: "board" | "list" | "task";
  entityId: string;
  entityTitle: string;
  createdAt: string;
};