package handlers

import (
    "fmt"
    "net/http"
    "strconv"
    "time"
    "taskflow/internal/models"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type CreateTaskRequest struct {
    Title       string  `json:"title" binding:"required"`
    Description string  `json:"description"`
    Status      string  `json:"status"`
    Priority    string  `json:"priority"`
    DueDate     *string `json:"due_date"`
}

type UpdateTaskRequest struct {
    Title       string  `json:"title"`
    Description string  `json:"description"`
    Status      string  `json:"status"`
    Priority    string  `json:"priority"`
    DueDate     *string `json:"due_date"`
}

func GetTasks(c *gin.Context) {
    userID := c.GetUint("user_id")
    
    var tasks []models.Task
    if err := db.Where("user_id = ?", userID).Find(&tasks).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
        return
    }
    
    c.JSON(http.StatusOK, tasks)
}

func GetTask(c *gin.Context) {
    userID := c.GetUint("user_id")
    taskID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
        return
    }
    
    var task models.Task
    if err := db.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch task"})
        }
        return
    }
    
    c.JSON(http.StatusOK, task)
}

func CreateTask(c *gin.Context) {
    userID := c.GetUint("user_id")
    
    var req CreateTaskRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    if req.Status == "" {
        req.Status = "pending"
    }
    if req.Priority == "" {
        req.Priority = "medium"
    }
    
    task := models.Task{
        Title:       req.Title,
        Description: req.Description,
        Status:      req.Status,
        Priority:    req.Priority,
        UserID:      userID,
    }
    
    if req.DueDate != nil {
        dueDate, err := parseTime(*req.DueDate)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due date format"})
            return
        }
        task.DueDate = dueDate
    }
    
    if err := db.Create(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
        return
    }
    
    c.JSON(http.StatusCreated, task)
}

func UpdateTask(c *gin.Context) {
    userID := c.GetUint("user_id")
    taskID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
        return
    }
    
    var req UpdateTaskRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    var task models.Task
    if err := db.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch task"})
        }
        return
    }
    
    if req.Title != "" {
        task.Title = req.Title
    }
    if req.Description != "" {
        task.Description = req.Description
    }
    if req.Status != "" {
        task.Status = req.Status
    }
    if req.Priority != "" {
        task.Priority = req.Priority
    }
    if req.DueDate != nil {
        if *req.DueDate == "" {
            task.DueDate = nil
        } else {
            dueDate, err := parseTime(*req.DueDate)
            if err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due date format"})
                return
            }
            task.DueDate = dueDate
        }
    }
    
    if err := db.Save(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
        return
    }
    
    c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
    userID := c.GetUint("user_id")
    taskID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
        return
    }
    
    result := db.Where("id = ? AND user_id = ?", taskID, userID).Delete(&models.Task{})
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
        return
    }
    
    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func parseTime(timeStr string) (*time.Time, error) {
    if timeStr == "" {
        return nil, nil
    }
    
    layouts := []string{
        time.RFC3339,
        "2006-01-02T15:04:05Z",
        "2006-01-02 15:04:05",
        "2006-01-02",
    }
    
    for _, layout := range layouts {
        t, err := time.Parse(layout, timeStr)
        if err == nil {
            return &t, nil
        }
    }
    
    return nil, fmt.Errorf("could not parse time: %s", timeStr)
}
