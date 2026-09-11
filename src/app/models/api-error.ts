export interface ApiError {
  timestamp?: string;
  status?: number;
  error?: string;
  campos?: Record<string, string>;
}