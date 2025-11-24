// lib/db/types.ts

export interface Task {
  id: string;
  userId: string;
  title: string;
  week?: string;
  day?: string;
  hour?: string;
  minute?: string;
  priority?: string;
  reward?: string;
  focus?: string;
  stage?: string;
  status?: string;
  tags?: string; // comma or space separated
  createdAt?: string;
}

export interface TaskInput {
  title: string;
  week?: string;
  day?: string;
  hour?: string;
  minute?: string;
  priority?: string;
  reward?: string;
  focus?: string;
  stage?: string;
  status?: string;
  tags?: string;
}

export interface TaskDBPlugin {
  id: string;
  title: string;
  listTasks(
    userId: string,
    offset: number,
    limit: number
  ): Promise<Task[]>;
  addTask(userId: string, input: TaskInput): Promise<Task>;
  // you can add update/delete later
}
