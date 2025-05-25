import "dotenv/config";

import { CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { createBudgetUseCase } from "@/factories/budget";

async function run() {
  try {
    const userId = process.env.TEST_USER_ID;

    if (!userId) {
      throw new Error("TEST_USER_ID environment variable is required");
    }

    const budgetsData: CreateBudgetDto[] = [
      { name: "Rent", maximumSpending: 1500, colorTag: "#FF5722" },
      { name: "Utilities", maximumSpending: 300, colorTag: "#03A9F4" },
      { name: "Transportation", maximumSpending: 200, colorTag: "#9C27B0" },
      { name: "Dining Out", maximumSpending: 250, colorTag: "#FFC107" },
      { name: "Entertainment", maximumSpending: 400, colorTag: "#E91E63" },
      { name: "Internet", maximumSpending: 100, colorTag: "#00BCD4" },
      { name: "Phone Bill", maximumSpending: 60, colorTag: "#009688" },
      { name: "Savings", maximumSpending: 1000, colorTag: "#8BC34A" },
      { name: "Health Insurance", maximumSpending: 300, colorTag: "#CDDC39" },
      { name: "Gym Membership", maximumSpending: 50, colorTag: "#FF9800" },
      { name: "Pet Supplies", maximumSpending: 120, colorTag: "#FFEB3B" },
      { name: "Subscriptions", maximumSpending: 70, colorTag: "#3F51B5" },
      { name: "Car Payment", maximumSpending: 400, colorTag: "#673AB7" },
      { name: "Fuel", maximumSpending: 180, colorTag: "#F44336" },
      { name: "Home Supplies", maximumSpending: 220, colorTag: "#607D8B" },
      { name: "Childcare", maximumSpending: 800, colorTag: "#795548" },
      { name: "Loan Repayment", maximumSpending: 600, colorTag: "#9E9E9E" },
      { name: "Education", maximumSpending: 900, colorTag: "#FFCDD2" },
      { name: "Clothing", maximumSpending: 300, colorTag: "#C2185B" },
      { name: "Travel", maximumSpending: 1000, colorTag: "#7B1FA2" },
      { name: "Gifts", maximumSpending: 150, colorTag: "#E91E63" },
      { name: "Beauty Products", maximumSpending: 200, colorTag: "#BA68C8" },
      { name: "House Maintenance", maximumSpending: 350, colorTag: "#4DD0E1" },
      { name: "Emergency Fund", maximumSpending: 700, colorTag: "#AED581" },
      { name: "Business Expenses", maximumSpending: 1200, colorTag: "#F06292" },
      { name: "Donations", maximumSpending: 100, colorTag: "#A1887F" },
      { name: "Medical Bills", maximumSpending: 500, colorTag: "#90A4AE" },
      { name: "Hobbies", maximumSpending: 300, colorTag: "#CE93D8" },
      { name: "Electronics", maximumSpending: 800, colorTag: "#81D4FA" },
      { name: "Baby Supplies", maximumSpending: 400, colorTag: "#FFCCBC" },
      { name: "Furniture", maximumSpending: 1000, colorTag: "#D7CCC8" },
      { name: "Cleaning Services", maximumSpending: 150, colorTag: "#FFE082" },
      { name: "Home Decor", maximumSpending: 250, colorTag: "#BCAAA4" },
      { name: "Software", maximumSpending: 180, colorTag: "#80CBC4" },
      { name: "Cloud Storage", maximumSpending: 90, colorTag: "#E0F7FA" },
      { name: "Streaming Services", maximumSpending: 60, colorTag: "#B2EBF2" },
      { name: "Online Courses", maximumSpending: 500, colorTag: "#B3E5FC" },
      { name: "Toys", maximumSpending: 100, colorTag: "#F8BBD0" },
      { name: "Office Supplies", maximumSpending: 200, colorTag: "#DCEDC8" },
      { name: "Laundry", maximumSpending: 80, colorTag: "#FFF59D" },
      { name: "Parking Fees", maximumSpending: 120, colorTag: "#FFE0B2" },
      { name: "Snacks", maximumSpending: 90, colorTag: "#D1C4E9" },
      { name: "Bakery", maximumSpending: 60, colorTag: "#F0F4C3" },
      { name: "Insurance Premiums", maximumSpending: 650, colorTag: "#C5CAE9" },
      { name: "Investment", maximumSpending: 1000, colorTag: "#E6EE9C" },
      { name: "Books", maximumSpending: 300, colorTag: "#DCE775" },
      { name: "Games", maximumSpending: 400, colorTag: "#FFF176" },
      { name: "Fast Food", maximumSpending: 150, colorTag: "#FFD54F" },
      { name: "Miscellaneous", maximumSpending: 200, colorTag: "#FF8A65" },
    ];

    console.log(`Creating ${budgetsData.length} budgets for user: ${userId}`);
    const result = await Promise.all(
      budgetsData.map((budget) => createBudgetUseCase.execute(userId, budget))
    );

    console.log("Budgets created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating budgets:", error);
  }
}

run();
