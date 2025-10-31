import { useMemo } from 'react';
import type { Task } from '../types';
import type { FilterOptions } from '../components/tasks/TaskFilters';

export const useTaskFilters = (tasks: Task[], filters: FilterOptions) => {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchTerm);
        const matchesDescription = task.description?.toLowerCase().includes(searchTerm);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Due date filter
      if (filters.dueDate && task.due_date) {
        const dueDate = new Date(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const endOfWeek = new Date(today);
        endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

        switch (filters.dueDate) {
          case 'today':
            if (dueDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'tomorrow':
            if (dueDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'week':
            if (dueDate < today || dueDate > endOfWeek) return false;
            break;
          case 'overdue':
            if (dueDate >= today) return false;
            break;
          case 'future':
            if (dueDate <= today) return false;
            break;
        }
      } else if (filters.dueDate === 'overdue') {
        // For overdue, also include tasks without due date that are pending?
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        const today = new Date();
        if (dueDate >= today) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const stats = useMemo(() => ({
    total: tasks.length,
    filtered: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
  }), [tasks, filteredTasks]);

  return {
    filteredTasks,
    stats
  };
};
