package services

import (
    "taskflow/internal/models"
)

type TaskSyncService struct {
    calendarService *GoogleCalendarService
}

func NewTaskSyncService() *TaskSyncService {
    return &TaskSyncService{
        calendarService: NewGoogleCalendarService(),
    }
}

func (s *TaskSyncService) SyncTaskToCalendar(task *models.Task, user *models.User) error {
    if !user.CalendarSync || user.GoogleToken == "" || task.DueDate == nil {
        return nil
    }

    token, err := s.calendarService.GetTokenFromJSON(user.GoogleToken)
    if err != nil {
        return err
    }

    // If task already has a Google Event ID, update it
    if task.GoogleEventID != "" {
        _, err = s.calendarService.UpdateEvent(token, task.GoogleEventID, task.Title, task.Description, *task.DueDate)
        return err
    }

    // Otherwise create new event
    event, err := s.calendarService.CreateEvent(token, task.Title, task.Description, *task.DueDate)
    if err != nil {
        return err
    }

    task.GoogleEventID = event.Id
    return nil
}

func (s *TaskSyncService) RemoveTaskFromCalendar(task *models.Task, user *models.User) error {
    if task.GoogleEventID == "" || user.GoogleToken == "" {
        return nil
    }

    token, err := s.calendarService.GetTokenFromJSON(user.GoogleToken)
    if err != nil {
        return err
    }

    err = s.calendarService.DeleteEvent(token, task.GoogleEventID)
    if err != nil {
        return err
    }

    task.GoogleEventID = ""
    return nil
}

func (s *TaskSyncService) HandleTaskStatusChange(task *models.Task, user *models.User) error {
    // Remove from calendar if task is completed
    if task.Status == "completed" {
        return s.RemoveTaskFromCalendar(task, user)
    }

    // Sync to calendar if task has due date and is not completed
    if task.DueDate != nil && task.Status != "completed" {
        return s.SyncTaskToCalendar(task, user)
    }

    return nil
}

func (s *TaskSyncService) SyncAllUserTasks(user *models.User, tasks []models.Task) error {
    if !user.CalendarSync || user.GoogleToken == "" {
        return nil
    }

    token, err := s.calendarService.GetTokenFromJSON(user.GoogleToken)
    if err != nil {
        return err
    }

    for i := range tasks {
        task := &tasks[i]
        // Only sync tasks with due dates that are not completed
        if task.DueDate != nil && task.Status != "completed" {
            if task.GoogleEventID == "" {
                // Create new event
                event, err := s.calendarService.CreateEvent(token, task.Title, task.Description, *task.DueDate)
                if err != nil {
                    return err
                }
                task.GoogleEventID = event.Id
            } else {
                // Update existing event
                _, err = s.calendarService.UpdateEvent(token, task.GoogleEventID, task.Title, task.Description, *task.DueDate)
                if err != nil {
                    return err
                }
            }
        } else if task.GoogleEventID != "" {
            // Remove events for tasks without due dates or completed tasks
            s.calendarService.DeleteEvent(token, task.GoogleEventID)
            task.GoogleEventID = ""
        }
    }

    return nil
}

func (s *TaskSyncService) CleanupCompletedTasks(user *models.User, tasks []models.Task) error {
    if user.GoogleToken == "" {
        return nil
    }

    token, err := s.calendarService.GetTokenFromJSON(user.GoogleToken)
    if err != nil {
        return err
    }

    for i := range tasks {
        task := &tasks[i]
        if task.Status == "completed" && task.GoogleEventID != "" {
            s.calendarService.DeleteEvent(token, task.GoogleEventID)
            task.GoogleEventID = ""
        }
    }

    return nil
}
