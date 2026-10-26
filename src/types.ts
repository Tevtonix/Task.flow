export type Priority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}