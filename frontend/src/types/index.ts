export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'instagram' | 'referral';
  notes?: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: PaginationMeta;
  };
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationMeta;
  };
}