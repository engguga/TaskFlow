package config

import (
    "fmt"
    "log"
    "os"
    "taskflow/internal/models"
    
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func InitDatabase() (*gorm.DB, error) {
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        dsn = "host=localhost user=user password=password dbname=taskflow port=5432 sslmode=disable"
    }
    
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, fmt.Errorf("erro ao conectar com banco: %w", err)
    }
    
    err = db.AutoMigrate(&models.User{}, &models.Task{})
    if err != nil {
        return nil, fmt.Errorf("erro ao migrar banco: %w", err)
    }
    
    log.Println("Banco de dados conectado e migrado com sucesso!")
    return db, nil
}
