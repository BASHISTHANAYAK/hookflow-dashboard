export type UserRole = "CUSTOMER" | "ADMIN";

export type SubscriptionStatus =
  | "Active"
  | "Overdue"
  | "Pending"
  | "Cancelled"
  | "Paused";

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  getUser?: User;
  token?: string;
}

export interface Subscription {
  userid?: string;
  razorpaySubscriptionId?: string;
  paymentLink?: string;
  status: SubscriptionStatus;
  amount: number;
  dueDate: string;
  linkGeneratedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  perPageLimit?: number;
  totalNumberOfDocuments?: number;
  total?: number;
  limit?: number;
  totalPages?: number;
}

export interface PlanInfo {
  price: number;
  currency: string;
  duration: string;
  interval?: number;
}

export interface MyPlansResponse {
  message?: string;
  pagination?: Pagination;
  subscriptions?: Subscription[];
  planInfo?: PlanInfo;
  getAllActiveSubscrptions?: Subscription[];
}

export interface GenerateLinkResponse {
  success?: boolean;
  paymentLink?: string;
  subscriptionId?: string;
  requiresCardUpdate?: boolean;
  razorpaySubscriptionId?: string;
  message?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    status: SubscriptionStatus;
  };
}

export interface AdminStats {
  totalRevenue: number;
  activeUsers: number;
  failedPayments: number;
}

export interface AdminStatsResponse {
  success: boolean;
  data?: AdminStats;
  message?: string;
}

export interface AdminUser {
  userId: string;
  email: string;
  phoneNumber: string;
  status: SubscriptionStatus;
  dueDate: string;
  amount: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data?: {
    users: AdminUser[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface SimulateFailureResponse {
  success: boolean;
  message: string;
  data?: {
    newStatus: string;
    newDueDate: string;
  };
}

export interface RazorpayOptions {
  key: string;
  subscription_id?: string;
  subscription_card_change?: number;
  name?: string;
  description?: string;
  image?: string;
  handler?: (response: {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  [key: string]: any;
}

export interface RazorpayInstance {
  open: () => void;
  close?: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
