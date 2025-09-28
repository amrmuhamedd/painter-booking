export type UserRole = 'customer' | 'painter';

export const UserRole = {
  CUSTOMER: 'customer' as UserRole,
  PAINTER: 'painter' as UserRole,
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string;
  rating?: number;
}
