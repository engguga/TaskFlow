package main

import (
    "log"
    "taskflow/internal/config"
    "taskflow/internal/handlers"
    "taskflow/internal/middleware"
    
    "github.com/gin-gonic/gin"
)

func main() {
    db, err := config.InitDatabase()
    if err != nil {
        log.Fatal("Erro ao conectar com banco de dados:", err)
    }

    handlers.InitDB(db)
    
    calendarHandler := handlers.NewCalendarHandler(db)
    
    r := gin.Default()
    
    r.Use(middleware.CORS())
    
    public := r.Group("/api")
    {
        public.POST("/auth/register", handlers.Register)
        public.POST("/auth/login", handlers.Login)
    }
    
    protected := r.Group("/api")
    protected.Use(middleware.AuthMiddleware())
    {
        // Tasks routes
        protected.GET("/tasks", handlers.GetTasks)
        protected.POST("/tasks", handlers.CreateTask)
        protected.GET("/tasks/:id", handlers.GetTask)
        protected.PUT("/tasks/:id", handlers.UpdateTask)
        protected.DELETE("/tasks/:id", handlers.DeleteTask)

        // Calendar routes
        protected.POST("/calendar/auth", calendarHandler.InitGoogleAuth)
        protected.POST("/calendar/callback", calendarHandler.HandleGoogleCallback)
        protected.POST("/calendar/sync", calendarHandler.ToggleCalendarSync)
        protected.GET("/calendar/status/:user_id", calendarHandler.GetSyncStatus)
        protected.POST("/calendar/disconnect/:user_id", calendarHandler.DisconnectGoogle)
    }
    
    r.Run(":8080")
}
