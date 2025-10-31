import { api } from './api';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  task_id?: string;
}

export const calendarService = {
  getEvents: () => api.get<CalendarEvent[]>('/calendar/events'),
  createEvent: (event: Omit<CalendarEvent, 'id'>) => 
    api.post<CalendarEvent>('/calendar/events', event),
  updateEvent: (id: string, event: Partial<CalendarEvent>) => 
    api.put<CalendarEvent>(`/calendar/events/${id}`, event),
  deleteEvent: (id: string) => api.delete(`/calendar/events/${id}`),
};
