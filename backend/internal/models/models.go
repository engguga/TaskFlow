package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID           uint           `json:"id" gorm:"primaryKey"`
    Name         string         `json:"name" gorm:"not null"`
    Email        string         `json:"email" gorm:"uniqueIndex;not null"`
    Password     string         `json:"-" gorm:"not null"`
    GoogleToken  string         `json:"-" gorm:"type:text"`
    CalendarSync bool           `json:"calendar_sync" gorm:"default:false"`
    Tasks        []Task         `json:"tasks,omitempty"`
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

type Task struct {
    ID            uint           `json:"id" gorm:"primaryKey"`
    Title         string         `json:"title" gorm:"not null"`
    Description   string         `json:"description"`
    Status        string         `json:"status" gorm:"default:pending"`
    Priority      string         `json:"priority" gorm:"default:medium"`
    DueDate       *time.Time     `json:"due_date"`
    UserID        uint           `json:"user_id" gorm:"not null;index"`
    User          User           `json:"-" gorm:"foreignKey:UserID"`
    GoogleEventID string         `json:"google_event_id" gorm:"size:255"`
    CreatedAt     time.Time      `json:"created_at"`
    UpdatedAt     time.Time      `json:"updated_at"`
    DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}
