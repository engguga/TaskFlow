export interface GoogleAuthResponse {
  auth_url: string;
}

export interface GoogleCallbackRequest {
  code: string;
  user_id: number;
}

export interface SyncStatus {
  calendar_sync: boolean;
  google_connected: boolean;
}

export interface SyncToggleRequest {
  user_id: number;
  enable: boolean;
}
