import React, { createContext, useContext, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { Transaction, Role, MOCK_TRANSACTIONS, MOCK_MONTHLY_DATA, MOCK_SPENDING_CATEGORIES, MonthlyData, SpendingCategory } from '../data';

interface DashboardContextType {
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterType: 'All' | 'income' | 'expense';
  setFilterType: (type: 'All' | 'income' | 'expense') => void;
  monthlyData: MonthlyData[];
  spendingCategories: SpendingCategory[];
  filteredTransactions: Transaction[];
  stats: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    incomeChange: string;
    expenseChange: string;
    balanceChange: string;
  };
  insights: {
    highestCategory: string;
    highestAmount: number;
    savingsRate: string;
    monthlyTrend: 'up' | 'down';
  };
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = 'fintrack_data';

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('fintrack_role');
    return (saved as Role) || 'admin';
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fintrack_dark_mode');
    return saved === 'true';
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState<'All' | 'income' | 'expense'>('All');

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_role', role);
  }, [role]);

  useLayoutEffect(() => {
    localStorage.setItem('fintrack_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
      const matchesType = filterType === 'All' || tx.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, filterCategory, filterType]);

  const stats = useMemo(() => {
    const baseBalance = 24560;
    const currentIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);
    const currentExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => acc + tx.amount, 0);

    return {
      totalBalance: baseBalance + currentIncome - currentExpenses,
      monthlyIncome: currentIncome,
      monthlyExpenses: currentExpenses,
      incomeChange: '+4.2%',
      expenseChange: '-2.1%',
      balanceChange: '+12.5%'
    };
  }, [transactions]);

  const insights = useMemo(() => {
    const categories = transactions.reduce((acc, tx) => {
      if (tx.type === 'expense') {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    let highestCategory = 'None';
    let highestAmount = 0;
    Object.entries(categories).forEach(([cat, amt]) => {
      const amount = amt as number;
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = cat;
      }
    });

    const savingsRate = stats.monthlyIncome > 0 
      ? (((stats.monthlyIncome - stats.monthlyExpenses) / stats.monthlyIncome) * 100).toFixed(1)
      : '0';

    return {
      highestCategory,
      highestAmount,
      savingsRate: `${savingsRate}%`,
      monthlyTrend: stats.monthlyIncome > stats.monthlyExpenses ? 'up' : 'down' as 'up' | 'down'
    };
  }, [transactions, stats]);

  return (
    <DashboardContext.Provider value={{
      role, setRole,
      darkMode, toggleDarkMode,
      transactions, addTransaction, deleteTransaction,
      searchQuery, setSearchQuery,
      filterCategory, setFilterCategory,
      filterType, setFilterType,
      monthlyData: MOCK_MONTHLY_DATA,
      spendingCategories: MOCK_SPENDING_CATEGORIES,
      filteredTransactions,
      stats,
      insights,
      isLoading
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
