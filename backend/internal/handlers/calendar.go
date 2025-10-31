package handlers

import (
    "net/http"
    "taskflow/internal/models"
    "taskflow/internal/services"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type CalendarHandler struct {
    calendarService *services.GoogleCalendarService
    db              *gorm.DB
}

func NewCalendarHandler(db *gorm.DB) *CalendarHandler {
    return &CalendarHandler{
        calendarService: services.NewGoogleCalendarService(),
        db:              db,
    }
}

type GoogleAuthRequest struct {
    UserID uint `json:"user_id" binding:"required"`
}

type GoogleAuthResponse struct {
    AuthURL string `json:"auth_url"`
}

type GoogleCallbackRequest struct {
    Code   string `json:"code" binding:"required"`
    UserID uint   `json:"user_id" binding:"required"`
}

func (h *CalendarHandler) InitGoogleAuth(c *gin.Context) {
    var req GoogleAuthRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    state := "user_" + string(rune(req.UserID))
    authURL := h.calendarService.GetAuthURL(state)

    response := GoogleAuthResponse{
        AuthURL: authURL,
    }

    c.JSON(http.StatusOK, response)
}

func (h *CalendarHandler) HandleGoogleCallback(c *gin.Context) {
    var req GoogleCallbackRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, err := h.calendarService.ExchangeCode(req.Code)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange code for token"})
        return
    }

    tokenJSON, err := h.calendarService.TokenToJSON(token)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize token"})
        return
    }

    // Update user with Google token and enable calendar sync
    var user models.User
    if err := h.db.First(&user, req.UserID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    user.GoogleToken = tokenJSON
    user.CalendarSync = true
    if err := h.db.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Google Calendar connected successfully",
        "sync_enabled": true,
    })
}

type SyncToggleRequest struct {
    UserID uint `json:"user_id" binding:"required"`
    Enable bool `json:"enable" binding:"required"`
}

func (h *CalendarHandler) ToggleCalendarSync(c *gin.Context) {
    var req SyncToggleRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := h.db.First(&user, req.UserID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    user.CalendarSync = req.Enable
    if err := h.db.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update calendar sync"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":     "Calendar sync updated",
        "sync_enabled": req.Enable,
    })
}

func (h *CalendarHandler) GetSyncStatus(c *gin.Context) {
    userID := c.Param("user_id")

    var user models.User
    if err := h.db.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "calendar_sync": user.CalendarSync,
        "google_connected": user.GoogleToken != "",
    })
}

func (h *CalendarHandler) DisconnectGoogle(c *gin.Context) {
    userID := c.Param("user_id")

    var user models.User
    if err := h.db.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    user.GoogleToken = ""
    user.CalendarSync = false
    if err := h.db.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to disconnect Google Calendar"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Google Calendar disconnected successfully",
    })
}
