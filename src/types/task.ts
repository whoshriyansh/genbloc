export interface Priority {
  _id: string;
  name: string;
  color: string;
  createdBy?: string;
}

export interface Category {
  _id: string;
  name: string;
  emoji?: string;
  createdBy?: string;
}

export interface Task {
  _id: string;
  name: string;
  dateTime: string;
  deadline: string;
  priority?: Priority;
  category?: Category[];
  completed: boolean;
  createdBy?: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface PriorityState {
  priorities: Priority[];
  loading: boolean;
  error: string | null;
}

export type CreateTaskPayload = {
  name: string;
  dateTime: string;
  deadline: string;
  completed: boolean;
  priority?: string | null;
  category?: string[];
};
