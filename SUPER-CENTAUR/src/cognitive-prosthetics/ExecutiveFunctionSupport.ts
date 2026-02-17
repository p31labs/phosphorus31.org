/**
 * Executive Function Support
 * Cognitive prosthetic for executive function support
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  subtasks: Subtask[];
  dueDate?: number;
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  createdAt: number;
  completedAt?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskBreakdown {
  taskId: string;
  steps: string[];
  estimatedTime: number;
  dependencies: string[];
}

export class ExecutiveFunctionSupport {
  private logger: Logger;
  private tasks: Map<string, Task> = new Map();
  private taskBreakdowns: Map<string, TaskBreakdown> = new Map();

  constructor() {
    this.logger = new Logger('ExecutiveFunctionSupport');
  }

  /**
   * Create new task
   */
  public createTask(
    title: string,
    description: string,
    priority: Task['priority'] = 'medium'
  ): Task {
    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      priority,
      status: 'pending',
      subtasks: [],
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, task);
    this.logger.info(`Task created: ${title}`);
    return task;
  }

  /**
   * Break down task into smaller steps
   */
  public breakDownTask(taskId: string, steps: string[]): TaskBreakdown {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const breakdown: TaskBreakdown = {
      taskId,
      steps,
      estimatedTime: steps.length * 15, // 15 minutes per step estimate
      dependencies: [],
    };

    this.taskBreakdowns.set(taskId, breakdown);
    this.logger.info(`Task broken down into ${steps.length} steps`);
    return breakdown;
  }

  /**
   * Add subtask to task
   */
  public addSubtask(taskId: string, title: string): Subtask {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const subtask: Subtask = {
      id: `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      completed: false,
    };

    task.subtasks.push(subtask);
    this.logger.info(`Subtask added: ${title}`);
    return subtask;
  }

  /**
   * Complete subtask
   */
  public completeSubtask(taskId: string, subtaskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (!subtask) {
      throw new Error(`Subtask not found: ${subtaskId}`);
    }

    subtask.completed = true;
    this.logger.info(`Subtask completed: ${subtask.title}`);

    // Check if all subtasks are completed
    if (task.subtasks.every(s => s.completed)) {
      this.completeTask(taskId);
    }
  }

  /**
   * Start task
   */
  public startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = 'in-progress';
    this.logger.info(`Task started: ${task.title}`);
  }

  /**
   * Complete task
   */
  public completeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = 'completed';
    task.completedAt = Date.now();
    
    if (task.createdAt && task.completedAt) {
      task.actualTime = Math.round((task.completedAt - task.createdAt) / 1000 / 60);
    }

    this.logger.info(`Task completed: ${task.title}`);
  }

  /**
   * Get task
   */
  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  public getTasksByStatus(status: Task['status']): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.status === status);
  }

  /**
   * Get tasks by priority
   */
  public getTasksByPriority(priority: Task['priority']): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.priority === priority);
  }

  /**
   * Get task breakdown
   */
  public getTaskBreakdown(taskId: string): TaskBreakdown | undefined {
    return this.taskBreakdowns.get(taskId);
  }

  /**
   * Get next recommended task
   */
  public getNextRecommendedTask(): Task | null {
    // Prioritize high priority, then in-progress, then pending
    const highPriority = this.getTasksByPriority('high').filter(t => t.status === 'pending');
    if (highPriority.length > 0) {
      return highPriority[0];
    }

    const inProgress = this.getTasksByStatus('in-progress');
    if (inProgress.length > 0) {
      return inProgress[0];
    }

    const pending = this.getTasksByStatus('pending');
    if (pending.length > 0) {
      return pending[0];
    }

    return null;
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.tasks.clear();
    this.taskBreakdowns.clear();
    this.logger.info('Executive Function Support disposed');
  }
}
