import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreHorizontal,
  Calendar,
  Plus,
  Trash2,
  Filter,
  Search,
  Zap,
  Target,
  ArrowRight,
  Shield,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, TopNav } from './components/Navigation';
import { StatCard, Card } from './components/DashboardCards';
import { SpendingChart, CategoryChart } from './components/Charts';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { cn } from './lib/utils';

const DashboardContent = () => {
  const { 
    role, 
    filteredTransactions, 
    deleteTransaction, 
    addTransaction,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    setSearchQuery,
    stats,
    insights,
    isLoading
  } = useDashboard();

  const [isAdding, setIsAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newTx, setNewTx] = useState({
    merchant: '',
    amount: 0,
    category: 'Food',
    type: 'expense' as const,
    status: 'completed' as const,
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['All', 'Food', 'Salary', 'Transport', 'Shopping', 'Entertainment', 'Housing'];
  const types: ('All' | 'income' | 'expense')[] = ['All', 'income', 'expense'];

  const handleAdd = () => {
    // Validation
    if (!newTx.merchant.trim()) {
      setFormError('Merchant name is required');
      return;
    }
    if (newTx.amount <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }

    addTransaction(newTx);
    setIsAdding(false);
    setFormError(null);
    setNewTx({
      merchant: '',
      amount: 0,
      category: 'Food',
      type: 'expense',
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className={cn(
      "flex min-h-screen transition-colors duration-500",
      role === 'admin' ? "bg-slate-50 dark:bg-slate-950" : "bg-slate-100/50 dark:bg-slate-900/50"
    )}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
              Initializing FinTrack...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNav />
        
        <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className={cn(
                  "text-3xl font-bold transition-colors duration-500",
                  role === 'admin' ? "text-slate-900 dark:text-slate-50" : "text-slate-700 dark:text-slate-300"
                )}>
                  Financial Overview
                </h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm transition-all duration-500",
                  role === 'admin' 
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-900/20" 
                    : "bg-slate-400 text-white ring-4 ring-slate-100 dark:ring-slate-800"
                )}>
                  {role === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
                  {role}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                {role === 'admin' 
                  ? "Full administrative access enabled. You can manage all transactions." 
                  : "Read-only access. Management features are disabled for your security."}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <Calendar size={18} />
                Last 30 Days
              </button>
              {role === 'admin' ? (
                <button 
                  onClick={() => { setIsAdding(!isAdding); setFormError(null); }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900"
                >
                  {isAdding ? <ArrowRight className="rotate-180" size={18} /> : <Plus size={18} />}
                  {isAdding ? 'Close Form' : 'Add Transaction'}
                </button>
              ) : (
                <button 
                  disabled
                  className="flex items-center gap-2 bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed opacity-60 grayscale"
                >
                  <Plus size={18} />
                  Add Transaction
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500",
            role === 'viewer' && "opacity-90 grayscale-[0.2]"
          )}>
            <StatCard 
              title="Total Balance" 
              value={`$${stats.totalBalance.toLocaleString()}`} 
              change={stats.balanceChange} 
              trend="up"
              icon={<DollarSign size={24} />}
              color={role === 'admin' ? "bg-indigo-600" : "bg-slate-600"}
            />
            <StatCard 
              title="Monthly Income" 
              value={`$${stats.monthlyIncome.toLocaleString()}`} 
              change={stats.incomeChange} 
              trend="up"
              icon={<ArrowUpRight size={24} />}
              color={role === 'admin' ? "bg-emerald-500" : "bg-slate-500"}
            />
            <StatCard 
              title="Monthly Expenses" 
              value={`$${stats.monthlyExpenses.toLocaleString()}`} 
              change={stats.expenseChange} 
              trend="down"
              icon={<ArrowDownLeft size={24} />}
              color={role === 'admin' ? "bg-rose-500" : "bg-slate-400"}
            />
          </div>

          {/* Insights Section */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500",
            role === 'viewer' && "opacity-80"
          )}>
            <Card className={cn(
              "border-none text-white transition-all duration-500",
              role === 'admin' ? "bg-gradient-to-br from-indigo-600 to-violet-700 shadow-indigo-100 dark:shadow-indigo-900/10 shadow-xl" : "bg-slate-700 dark:bg-slate-800"
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-indigo-100 dark:text-indigo-200 text-sm font-medium opacity-80">Savings Rate</p>
                  <h4 className="text-3xl font-bold mt-1">{insights.savingsRate}</h4>
                  <p className="text-indigo-200 dark:text-indigo-300 text-xs mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> 5% higher than last month
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Target size={24} />
                </div>
              </div>
            </Card>
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Top Spending</p>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{insights.highestCategory}</h4>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                    Total: ${insights.highestAmount.toLocaleString()}
                  </p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl transition-colors duration-500",
                  role === 'admin' ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  <Zap size={24} />
                </div>
              </div>
            </Card>
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Trend</p>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {insights.monthlyTrend === 'up' ? 'Positive' : 'Negative'}
                  </h4>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                    Cash flow is {insights.monthlyTrend === 'up' ? 'improving' : 'declining'}
                  </p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl transition-colors duration-500",
                  role === 'admin' 
                    ? (insights.monthlyTrend === 'up' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400")
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {insights.monthlyTrend === 'up' ? <TrendingUp size={24} /> : <TrendingUp className="rotate-180" size={24} />}
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className={cn(
            "grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500",
            role === 'viewer' && "grayscale-[0.4]"
          )}>
            <Card className="lg:col-span-2 shadow-sm" title="Income vs Expenses" subtitle="Track your cash flow over the last 6 months">
              <SpendingChart />
            </Card>
            <Card title="Spending by Category" subtitle="Where your money goes" className="shadow-sm">
              <CategoryChart />
            </Card>
          </div>

          {/* Comparison Section */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500",
            role === 'viewer' && "opacity-80"
          )}>
            <Card title="Monthly Comparison" subtitle="Comparing current vs previous month performance" className="shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Income Growth</span>
                    <span className={cn("font-bold", role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400")}>+12%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full w-[75%] transition-all duration-1000", role === 'admin' ? "bg-emerald-500" : "bg-slate-400")}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Expense Reduction</span>
                    <span className={cn("font-bold", role === 'admin' ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400")}>-4%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full w-[40%] transition-all duration-1000", role === 'admin' ? "bg-rose-500" : "bg-slate-300")}></div>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Budget Goals" subtitle="Progress on your financial targets" className="shadow-sm">
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all duration-500",
                  role === 'admin' ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm", role === 'admin' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}>
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Emergency Fund</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">$8,500 / $10,000</p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold", role === 'admin' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>85%</span>
                </div>
                <div className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all duration-500",
                  role === 'admin' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm", role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")}>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Investment Goal</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">$2,400 / $5,000</p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold", role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500")}>48%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Transactions Section */}
          <div className="grid grid-cols-1 gap-6">
            <Card 
              title="Transaction Dashboard" 
              subtitle="Full history of your financial activity"
              className={cn(
                "shadow-sm transition-all duration-500",
                role === 'admin' ? "border-indigo-100 dark:border-indigo-900/30" : "border-slate-200 dark:border-slate-800"
              )}
            >
              <div className="flex flex-col lg:flex-row gap-6 mb-8 justify-between items-start lg:items-center">
                <div className="space-y-4 w-full lg:w-auto">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Filter by Category</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                            filterCategory === cat 
                              ? (role === 'admin' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none" : "bg-slate-700 dark:bg-slate-600 text-white shadow-md") 
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Filter by Type</span>
                    <div className="flex gap-2">
                      {types.map(t => (
                        <button
                          key={t}
                          onClick={() => setFilterType(t)}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider",
                            filterType === t
                              ? (role === 'admin' ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800" : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600")
                              : "bg-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Filter size={16} />
                  <span>Showing {filteredTransactions.length} transactions</span>
                </div>
              </div>

              <AnimatePresence>
                {isAdding && role === 'admin' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-8 p-6 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 ring-2 ring-indigo-500/10">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300">New Transaction</h4>
                        {formError && (
                          <span className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/30">
                            {formError}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase ml-1">Merchant</label>
                          <input 
                            placeholder="e.g. Starbucks" 
                            className={cn(
                              "w-full px-4 py-2 rounded-xl border focus:ring-2 ring-indigo-500/20 outline-none transition-all bg-white dark:bg-slate-800 dark:text-slate-100",
                              formError && !newTx.merchant ? "border-rose-300 bg-rose-50 dark:bg-rose-900/20" : "border-indigo-100 dark:border-indigo-900/30"
                            )}
                            value={newTx.merchant}
                            onChange={e => { setNewTx({...newTx, merchant: e.target.value}); setFormError(null); }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase ml-1">Amount</label>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            className={cn(
                              "w-full px-4 py-2 rounded-xl border focus:ring-2 ring-indigo-500/20 outline-none transition-all bg-white dark:bg-slate-800 dark:text-slate-100",
                              formError && newTx.amount <= 0 ? "border-rose-300 bg-rose-50 dark:bg-rose-900/20" : "border-indigo-100 dark:border-indigo-900/30"
                            )}
                            value={newTx.amount || ''}
                            onChange={e => { setNewTx({...newTx, amount: parseFloat(e.target.value)}); setFormError(null); }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase ml-1">Category</label>
                          <select 
                            className="w-full px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30 focus:ring-2 ring-indigo-500/20 outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
                            value={newTx.category}
                            onChange={e => setNewTx({...newTx, category: e.target.value})}
                          >
                            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-2 items-end">
                          <button 
                            onClick={handleAdd}
                            className="flex-1 h-[42px] bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => { setIsAdding(false); setFormError(null); }}
                            className="px-4 h-[42px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Merchant</th>
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="pb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <AnimatePresence mode="popLayout">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={tx.id} 
                            className={cn(
                              "group transition-colors",
                              role === 'admin' ? "hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10" : "hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                            )}
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                  tx.type === 'income' 
                                    ? (role === 'admin' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-200 dark:bg-slate-800 text-slate-500") 
                                    : (role === 'admin' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400")
                                )}>
                                  {tx.type === 'income' ? <TrendingUp size={20} /> : <CreditCard size={20} />}
                                </div>
                                <span className={cn(
                                  "font-medium transition-colors duration-500",
                                  role === 'admin' ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                                )}>
                                  {tx.merchant}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{tx.category}</td>
                            <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{tx.date}</td>
                            <td className="py-4">
                              <span className={cn(
                                "font-semibold transition-colors duration-500",
                                tx.type === 'income' 
                                  ? (role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400") 
                                  : (role === 'admin' ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300")
                              )}>
                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium transition-all duration-500",
                                tx.status === 'completed' 
                                  ? (role === 'admin' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-200 dark:bg-slate-800 text-slate-500") 
                                  : (role === 'admin' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400")
                              )}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {role === 'admin' ? (
                                <button 
                                  onClick={() => deleteTransaction(tx.id)}
                                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={18} />
                                </button>
                              ) : (
                                <div className="p-2 text-slate-300 dark:text-slate-600 opacity-40">
                                  <Shield size={16} />
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
                              <Search size={48} strokeWidth={1} />
                              <p className="text-sm">No transactions found matching your criteria.</p>
                              <button 
                                onClick={() => {setSearchQuery(''); setFilterCategory('All'); setFilterType('All');}}
                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                              >
                                Clear all filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
