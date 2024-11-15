export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AdminUser extends User {
  isAdmin: boolean;
}