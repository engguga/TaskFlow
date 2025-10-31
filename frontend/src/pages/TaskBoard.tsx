import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters, FilterOptions } from '../components/tasks/TaskFilters';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { TaskColumnSkeleton } from '../components/ui/Skeleton';
import { useTasks } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const TaskBoard: React.FC = () => {
  const { tasks, loading, error, deletingId, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; task: Task | null }>({
    isOpen: false,
    task: null
  });
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priority: '',
    status: '',
    dueDate: ''
  });

  const { filteredTasks, stats } = useTaskFilters(tasks, filters);

  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  const handleCreateTask = async (taskData: CreateTaskRequest): Promise<boolean> => {
    return await createTask(taskData);
  };

  const handleUpdateTask = async (taskData: UpdateTaskRequest): Promise<boolean> => {
    if (!editingTask) return false;
    return await updateTask(editingTask.id, taskData);
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteConfirm({ isOpen: true, task });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.task) {
      await deleteTask(deleteConfirm.task.id);
      setDeleteConfirm({ isOpen: false, task: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, task: null });
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    await updateTaskStatus(taskId, newStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      priority: '',
      status: '',
      dueDate: ''
    });
  };

  const TaskColumn: React.FC<{ 
    title: string; 
    tasks: Task[];
    status: string;
    color: string;
    darkColor: string;
  }> = ({ title, tasks, status, color, darkColor }) => (
    <div 
      className="flex-1"
      onDrop={(e) => handleDrop(e, status)}
      onDragOver={handleDragOver}
    >
      <div className={`${color} ${darkColor} rounded-lg p-4 mb-4 transition-colors`}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {title} ({tasks.length})
        </h3>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <Card 
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="cursor-move hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
                    disabled={deletingId === task.id}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm transition-colors disabled:opacity-50"
                  >
                    {deletingId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                  task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                } transition-colors`}>
                  {task.priority}
                </span>
                {task.due_date && (
                  <span className={`text-xs ${
                    new Date(task.due_date) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                  } transition-colors`}>
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Board</h1>
              <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
            <Button disabled>Add Task</Button>
          </div>
          <div className="flex space-x-6">
            <TaskColumnSkeleton />
            <TaskColumnSkeleton />
            <TaskColumnSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Board</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Showing {stats.filtered} of {stats.total} tasks
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded mb-4 transition-colors">
            {error}
          </div>
        )}

        <div className="flex space-x-6">
          <TaskColumn
            title="To Do"
            tasks={pendingTasks}
            status="pending"
            color="bg-blue-100"
            darkColor="dark:bg-blue-900/30"
          />
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            status="in_progress"
            color="bg-yellow-100"
            darkColor="dark:bg-yellow-900/30"
          />
          <TaskColumn
            title="Done"
            tasks={completedTasks}
            status="completed"
            color="bg-green-100"
            darkColor="dark:bg-green-900/30"
          />
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <TaskForm
                  task={editingTask || undefined}
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteConfirm.task?.title}"? This action cannot be undone.`}
          confirmText="Delete Task"
          cancelText="Keep Task"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deletingId === deleteConfirm.task?.id}
        />
      </main>
    </div>
  );
};
