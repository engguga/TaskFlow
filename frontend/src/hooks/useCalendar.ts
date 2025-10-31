import { useState, useEffect } from 'react';
import { calendarService, CalendarEvent } from '../services/calendarApi';

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Meeting',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          description: 'Weekly team sync',
        },
      ];
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent: CalendarEvent = {
        ...event,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      ));
    } catch (err) {
      setError('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: loadEvents,
  };
};
