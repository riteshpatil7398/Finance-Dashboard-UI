export type Role = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  merchant: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-03-25', amount: 120.50, category: 'Food', merchant: 'Whole Foods', type: 'expense', status: 'completed' },
  { id: '2', date: '2024-03-24', amount: 2500.00, category: 'Salary', merchant: 'Tech Corp', type: 'income', status: 'completed' },
  { id: '3', date: '2024-03-23', amount: 45.00, category: 'Transport', merchant: 'Uber', type: 'expense', status: 'completed' },
  { id: '4', date: '2024-03-22', amount: 89.99, category: 'Shopping', merchant: 'Amazon', type: 'expense', status: 'pending' },
  { id: '5', date: '2024-03-21', amount: 15.00, category: 'Entertainment', merchant: 'Netflix', type: 'expense', status: 'completed' },
  { id: '6', date: '2024-03-20', amount: 350.00, category: 'Housing', merchant: 'Rent Payment', type: 'expense', status: 'completed' },
  { id: '7', date: '2024-03-19', amount: 65.20, category: 'Food', merchant: 'Starbucks', type: 'expense', status: 'completed' },
];

export const MOCK_SPENDING_CATEGORIES: SpendingCategory[] = [
  { name: 'Housing', value: 1200, color: '#6366f1' },
  { name: 'Food', value: 450, color: '#f59e0b' },
  { name: 'Transport', value: 200, color: '#10b981' },
  { name: 'Shopping', value: 350, color: '#ec4899' },
  { name: 'Entertainment', value: 150, color: '#8b5cf6' },
];

export const MOCK_MONTHLY_DATA: MonthlyData[] = [
  { month: 'Oct', income: 4500, expenses: 3200 },
  { month: 'Nov', income: 4800, expenses: 3100 },
  { month: 'Dec', income: 5200, expenses: 4500 },
  { month: 'Jan', income: 4700, expenses: 3300 },
  { month: 'Feb', income: 4900, expenses: 3400 },
  { month: 'Mar', income: 5100, expenses: 3150 },
];
