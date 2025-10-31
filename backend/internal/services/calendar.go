package services

import (
    "context"
    "encoding/json"
    "fmt"
    "os"
    "time"

    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
    "google.golang.org/api/calendar/v3"
    "google.golang.org/api/option"
)

var (
    googleOAuthConfig = &oauth2.Config{
        ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
        ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
        RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
        Scopes: []string{
            "https://www.googleapis.com/auth/calendar",
        },
        Endpoint: google.Endpoint,
    }
)

type GoogleCalendarService struct {
    config *oauth2.Config
}

func NewGoogleCalendarService() *GoogleCalendarService {
    return &GoogleCalendarService{
        config: googleOAuthConfig,
    }
}

func (s *GoogleCalendarService) GetAuthURL(state string) string {
    return s.config.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
}

func (s *GoogleCalendarService) ExchangeCode(code string) (*oauth2.Token, error) {
    return s.config.Exchange(context.Background(), code)
}

func (s *GoogleCalendarService) CreateEvent(token *oauth2.Token, taskTitle, taskDescription string, dueDate time.Time) (*calendar.Event, error) {
    client := s.config.Client(context.Background(), token)
    
    srv, err := calendar.NewService(context.Background(), option.WithHTTPClient(client))
    if err != nil {
        return nil, fmt.Errorf("unable to create Calendar service: %v", err)
    }

    event := &calendar.Event{
        Summary:     taskTitle,
        Description: taskDescription,
        Start: &calendar.EventDateTime{
            DateTime: dueDate.Format(time.RFC3339),
            TimeZone: "America/Sao_Paulo",
        },
        End: &calendar.EventDateTime{
            DateTime: dueDate.Add(1 * time.Hour).Format(time.RFC3339),
            TimeZone: "America/Sao_Paulo",
        },
        Reminders: &calendar.EventReminders{
            UseDefault: false,
            Overrides: []*calendar.EventReminder{
                {Method: "email", Minutes: 24 * 60},
                {Method: "popup", Minutes: 30},
            },
        },
    }

    createdEvent, err := srv.Events.Insert("primary", event).Do()
    if err != nil {
        return nil, fmt.Errorf("unable to create event: %v", err)
    }

    return createdEvent, nil
}

func (s *GoogleCalendarService) UpdateEvent(token *oauth2.Token, eventID, taskTitle, taskDescription string, dueDate time.Time) (*calendar.Event, error) {
    client := s.config.Client(context.Background(), token)
    
    srv, err := calendar.NewService(context.Background(), option.WithHTTPClient(client))
    if err != nil {
        return nil, fmt.Errorf("unable to create Calendar service: %v", err)
    }

    event := &calendar.Event{
        Summary:     taskTitle,
        Description: taskDescription,
        Start: &calendar.EventDateTime{
            DateTime: dueDate.Format(time.RFC3339),
            TimeZone: "America/Sao_Paulo",
        },
        End: &calendar.EventDateTime{
            DateTime: dueDate.Add(1 * time.Hour).Format(time.RFC3339),
            TimeZone: "America/Sao_Paulo",
        },
    }

    updatedEvent, err := srv.Events.Update("primary", eventID, event).Do()
    if err != nil {
        return nil, fmt.Errorf("unable to update event: %v", err)
    }

    return updatedEvent, nil
}

func (s *GoogleCalendarService) DeleteEvent(token *oauth2.Token, eventID string) error {
    client := s.config.Client(context.Background(), token)
    
    srv, err := calendar.NewService(context.Background(), option.WithHTTPClient(client))
    if err != nil {
        return fmt.Errorf("unable to create Calendar service: %v", err)
    }

    err = srv.Events.Delete("primary", eventID).Do()
    if err != nil {
        return fmt.Errorf("unable to delete event: %v", err)
    }

    return nil
}

func (s *GoogleCalendarService) GetTokenFromJSON(tokenJSON string) (*oauth2.Token, error) {
    token := &oauth2.Token{}
    err := json.Unmarshal([]byte(tokenJSON), token)
    if err != nil {
        return nil, err
    }
    return token, nil
}

func (s *GoogleCalendarService) TokenToJSON(token *oauth2.Token) (string, error) {
    data, err := json.Marshal(token)
    if err != nil {
        return "", err
    }
    return string(data), nil
}
