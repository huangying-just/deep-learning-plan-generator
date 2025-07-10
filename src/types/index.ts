// API 请求和响应类型定义

export interface GeneratePlanRequest {
  topic: string;
}

export interface GeneratePlanResponse {
  plan?: string;
  error?: string;
}

// 应用状态类型
export interface AppState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
} 