import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  PieChart, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Shield,
  Eye,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useDashboard } from '../context/DashboardContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Wallet, label: 'Accounts', active: false },
  { icon: ArrowUpRight, label: 'Transactions', active: false },
  { icon: PieChart, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = () => {
  const { role, setRole } = useDashboard();

  return (
    <aside className={cn(
      "w-64 border-r transition-all duration-500 flex flex-col h-screen sticky top-0",
      role === 'admin' 
        ? "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/30" 
        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500",
          role === 'admin' ? "bg-indigo-600 shadow-indigo-200" : "bg-slate-600 shadow-slate-200"
        )}>
          <Wallet size={24} />
        </div>
        <span className={cn(
          "text-xl font-bold transition-all duration-500",
          role === 'admin' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
        )}>
          FinTrack
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              item.active 
                ? (role === 'admin' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm" : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm")
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="px-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Access Level</p>
          <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setRole('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                role === 'admin' 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Shield size={14} /> Admin
            </button>
            <button 
              onClick={() => setRole('viewer')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                role === 'viewer' 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Eye size={14} /> Viewer
            </button>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export const TopNav = () => {
  const { searchQuery, setSearchQuery, darkMode, toggleDarkMode, transactions } = useDashboard();

  const exportToCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Type', 'Status'];
    const rows = transactions.map(tx => [
      tx.date,
      tx.merchant,
      tx.category,
      tx.amount.toFixed(2),
      tx.type,
      tx.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fintrack_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions, categories..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Export to CSV"
        >
          <Download size={18} />
          <span className="hidden md:inline">Export</span>
        </button>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Alex Rivers</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Premium Plan</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
