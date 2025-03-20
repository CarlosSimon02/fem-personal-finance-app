// Temporary data for the financial dashboard

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  emoji: string;
  category: string;
};

export type Pot = {
  id: string;
  name: string;
  amount: number;
  color: string;
};

export type Budget = {
  id: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
};

export type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  color: string;
};

// List of categories for filtering
export const categories = [
  "Salary",
  "Rent",
  "Grocery",
  "Utilities",
  "Entertainment",
  "Transportation",
  "Dining",
  "Shopping",
  "Healthcare",
  "Education",
  "Travel",
  "Freelance",
  "Investment",
  "Other",
];

// Extended transactions data
export const transactions: Transaction[] = [
  {
    id: "1",
    name: "Salary",
    category: "Salary",
    date: "18 Aug 2024",
    amount: 45000,
    type: "income", // Added type
    emoji: "💰", // Emoji for Salary
  },
  {
    id: "2",
    name: "Rent",
    category: "Rent",
    date: "15 Aug 2024",
    amount: -15000,
    type: "expense", // Added type
    emoji: "🏠", // Emoji for Rent
  },
  {
    id: "3",
    name: "Grocery Store",
    category: "Grocery",
    date: "14 Aug 2024",
    amount: -3500,
    type: "expense", // Added type
    emoji: "🛒", // Emoji for Grocery
  },
  {
    id: "4",
    name: "Freelance Work",
    category: "Freelance",
    date: "12 Aug 2024",
    amount: 12000,
    type: "income", // Added type
    emoji: "💻", // Emoji for Freelance
  },
  {
    id: "5",
    name: "Electricity Bill",
    category: "Utilities",
    date: "10 Aug 2024",
    amount: -2500,
    type: "expense", // Added type
    emoji: "💡", // Emoji for Utilities
  },
  {
    id: "6",
    name: "Water Bill",
    category: "Utilities",
    date: "10 Aug 2024",
    amount: -800,
    type: "expense", // Added type
    emoji: "🚰", // Emoji for Water
  },
  {
    id: "7",
    name: "Internet Bill",
    category: "Utilities",
    date: "09 Aug 2024",
    amount: -1500,
    type: "expense", // Added type
    emoji: "🌐", // Emoji for Internet
  },
  {
    id: "8",
    name: "Side Project",
    category: "Freelance",
    date: "08 Aug 2024",
    amount: 8000,
    type: "income", // Added type
    emoji: "🛠️", // Emoji for Side Project
  },
  {
    id: "9",
    name: "Restaurant",
    category: "Dining",
    date: "07 Aug 2024",
    amount: -2200,
    type: "expense", // Added type
    emoji: "🍽️", // Emoji for Dining
  },
  {
    id: "10",
    name: "Transportation",
    category: "Transportation",
    date: "05 Aug 2024",
    amount: -1000,
    type: "expense", // Added type
    emoji: "🚗", // Emoji for Transportation
  },
  {
    id: "11",
    name: "Movie Tickets",
    category: "Entertainment",
    date: "03 Aug 2024",
    amount: -800,
    type: "expense", // Added type
    emoji: "🎬", // Emoji for Entertainment
  },
  {
    id: "12",
    name: "Clothing Store",
    category: "Shopping",
    date: "02 Aug 2024",
    amount: -3500,
    type: "expense", // Added type
    emoji: "🛍️", // Emoji for Shopping
  },
  {
    id: "13",
    name: "Dividend Payment",
    category: "Investment",
    date: "01 Aug 2024",
    amount: 5000,
    type: "income", // Added type
    emoji: "📈", // Emoji for Investment
  },
  {
    id: "14",
    name: "Doctor Visit",
    category: "Healthcare",
    date: "30 Jul 2024",
    amount: -1500,
    type: "expense", // Added type
    emoji: "🏥", // Emoji for Healthcare
  },
  {
    id: "15",
    name: "Online Course",
    category: "Education",
    date: "28 Jul 2024",
    amount: -2000,
    type: "expense", // Added type
    emoji: "📚", // Emoji for Education
  },
  {
    id: "16",
    name: "Gym Membership",
    category: "Healthcare",
    date: "27 Jul 2024",
    amount: -1200,
    type: "expense", // Added type
    emoji: "💪", // Emoji for Gym
  },
  {
    id: "17",
    name: "Bonus",
    category: "Salary",
    date: "25 Jul 2024",
    amount: 15000,
    type: "income", // Added type
    emoji: "🎉", // Emoji for Bonus
  },
  {
    id: "18",
    name: "Flight Tickets",
    category: "Travel",
    date: "23 Jul 2024",
    amount: -12000,
    type: "expense", // Added type
    emoji: "✈️", // Emoji for Travel
  },
  {
    id: "19",
    name: "Hotel Booking",
    category: "Travel",
    date: "23 Jul 2024",
    amount: -8000,
    type: "expense", // Added type
    emoji: "🏨", // Emoji for Hotel
  },
  {
    id: "20",
    name: "Smartphone Purchase",
    category: "Shopping",
    date: "20 Jul 2024",
    amount: -25000,
    type: "expense", // Added type
    emoji: "📱", // Emoji for Shopping
  },
  {
    id: "21",
    name: "Consulting Fee",
    category: "Freelance",
    date: "18 Jul 2024",
    amount: 20000,
    type: "income", // Added type
    emoji: "💼", // Emoji for Freelance
  },
  {
    id: "22",
    name: "Car Maintenance",
    category: "Transportation",
    date: "15 Jul 2024",
    amount: -5000,
    type: "expense", // Added type
    emoji: "🔧", // Emoji for Car Maintenance
  },
  {
    id: "23",
    name: "Coffee Shop",
    category: "Dining",
    date: "12 Jul 2024",
    amount: -300,
    type: "expense", // Added type
    emoji: "☕", // Emoji for Coffee
  },
  {
    id: "24",
    name: "Book Store",
    category: "Education",
    date: "10 Jul 2024",
    amount: -1200,
    type: "expense", // Added type
    emoji: "📖", // Emoji for Education
  },
  {
    id: "25",
    name: "Stock Dividend",
    category: "Investment",
    date: "08 Jul 2024",
    amount: 3500,
    type: "income", // Added type
    emoji: "💹", // Emoji for Investment
  },
];

export const pots: Pot[] = [
  {
    id: "1",
    name: "Emergency Fund",
    amount: 50000,
    color: "#FF6384",
  },
  {
    id: "2",
    name: "Vacation",
    amount: 25000,
    color: "#36A2EB",
  },
  {
    id: "3",
    name: "New Laptop",
    amount: 35000,
    color: "#FFCE56",
  },
  {
    id: "4",
    name: "Home Renovation",
    amount: 40000,
    color: "#4BC0C0",
  },
  {
    id: "5",
    name: "Wedding",
    amount: 60000,
    color: "#9966FF",
  },
  {
    id: "6",
    name: "Car Fund",
    amount: 75000,
    color: "#FF9F40",
  },
];

export const budgets: Budget[] = [
  {
    id: "1",
    name: "Groceries",
    spent: 7500,
    limit: 10000,
    color: "#FF6384",
  },
  {
    id: "2",
    name: "Dining Out",
    spent: 5000,
    limit: 8000,
    color: "#36A2EB",
  },
  {
    id: "3",
    name: "Transportation",
    spent: 3000,
    limit: 5000,
    color: "#FFCE56",
  },
  {
    id: "4",
    name: "Entertainment",
    spent: 2500,
    limit: 4000,
    color: "#4BC0C0",
  },
  {
    id: "5",
    name: "Shopping",
    spent: 6000,
    limit: 7000,
    color: "#9966FF",
  },
  {
    id: "6",
    name: "Utilities",
    spent: 4800,
    limit: 5000,
    color: "#FF9F40",
  },
];

export const recurringBills: RecurringBill[] = [
  {
    id: "1",
    name: "Rent",
    amount: 15000,
    dueDate: "1st of every month",
    color: "#FF6384",
  },
  {
    id: "2",
    name: "Electricity",
    amount: 2500,
    dueDate: "10th of every month",
    color: "#36A2EB",
  },
  {
    id: "3",
    name: "Water",
    amount: 800,
    dueDate: "10th of every month",
    color: "#FFCE56",
  },
  {
    id: "4",
    name: "Internet",
    amount: 1500,
    dueDate: "9th of every month",
    color: "#4BC0C0",
  },
  {
    id: "5",
    name: "Phone Plan",
    amount: 1000,
    dueDate: "15th of every month",
    color: "#9966FF",
  },
];

// Helper functions to calculate totals
export async function getSummaryData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = income - expenses;

  return {
    balance,
    income,
    expenses,
  };
}

export async function getPotsData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const totalSaved = pots.reduce((sum, pot) => sum + pot.amount, 0);
  const topPots = [...pots].sort((a, b) => b.amount - a.amount).slice(0, 4);

  return {
    totalSaved,
    topPots,
  };
}

export async function getBudgetsData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const topBudgets = [...budgets].sort((a, b) => b.spent - a.spent).slice(0, 4);

  return {
    totalSpent,
    totalLimit,
    topBudgets,
  };
}

export async function getTransactionsData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    recentTransactions,
  };
}

export async function getRecurringBillsData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  const topBills = [...recurringBills]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return {
    topBills,
  };
}

// New function for filtered transactions with pagination
export async function getFilteredTransactions({
  search = "",
  category = "",
  sortBy = "date",
  order = "desc",
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Filter transactions
  let filteredTransactions = [...transactions];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
    );
  }

  // Apply category filter
  if (category) {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.category === category
    );
  }

  // Apply sorting
  filteredTransactions.sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "amount") {
      return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    return 0;
  });

  // Calculate pagination
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + pageSize
  );

  return {
    transactions: paginatedTransactions,
    totalTransactions,
    totalPages,
  };
}
