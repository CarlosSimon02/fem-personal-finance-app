// Temporary data for the financial dashboard

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  image: string;
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

export const transactions: Transaction[] = [
  {
    id: "1",
    name: "Salary",
    amount: 45000,
    date: "18 Aug 2024",
    type: "income",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Rent",
    amount: -15000,
    date: "15 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Grocery",
    amount: -3500,
    date: "14 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Freelance Work",
    amount: 12000,
    date: "12 Aug 2024",
    type: "income",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Electricity Bill",
    amount: -2500,
    date: "10 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Water Bill",
    amount: -800,
    date: "10 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Internet Bill",
    amount: -1500,
    date: "09 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Side Project",
    amount: 8000,
    date: "08 Aug 2024",
    type: "income",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Restaurant",
    amount: -2200,
    date: "07 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Transportation",
    amount: -1000,
    date: "05 Aug 2024",
    type: "expense",
    image: "/placeholder.svg?height=40&width=40",
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
