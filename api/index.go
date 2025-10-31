package handler

import (
	"encoding/json"
	"net/http"
)

type HealthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type Task struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	switch r.URL.Path {
	case "/api/health":
		response := HealthResponse{
			Status:  "ok",
			Message: "TaskFlow API is running",
		}
		json.NewEncoder(w).Encode(response)
		
	case "/api/tasks":
		if r.Method == "GET" {
			tasks := []Task{
				{ID: "1", Title: "First task from API"},
				{ID: "2", Title: "Second task from API"},
			}
			json.NewEncoder(w).Encode(tasks)
		} else {
			http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		}
		
	default:
		http.Error(w, `{"error": "Endpoint not found"}`, http.StatusNotFound)
	}
}
