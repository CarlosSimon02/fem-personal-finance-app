# Script Architecture Refactoring

## Overview

This document explains our script refactoring that consolidates individual script files into domain-specific, organized script modules following the **Single Responsibility Principle** and **DRY (Don't Repeat Yourself)** principles.

## Problem with Previous Approach

### **Before: Individual Script Files**

```
src/scripts/
├── createBudget.ts           # Single budget creation
├── createBulkBudgets.ts      # Bulk budget creation
├── getPaginatedBudgets.ts    # Budget listing
├── createIncome.ts           # Single income creation
├── createBulkIncomes.ts      # Bulk income creation
├── createTransaction.ts      # Single transaction creation
└── migrations/
    └── transactionMigrations.ts
```

**Issues:**

- ❌ **Code Duplication**: Similar validation and setup logic in every file
- ❌ **Scattered Functionality**: Related operations spread across multiple files
- ❌ **Maintenance Burden**: Need to update multiple files for common changes
- ❌ **Inconsistent Patterns**: Different error handling and logging approaches
- ❌ **No Command Interface**: Each script had its own execution pattern

## New Architecture: Domain-Specific Script Modules

### **Consolidated Structure**

```
src/scripts/
├── budgetScripts.ts          # All budget operations
├── incomeScripts.ts          # All income operations
├── transactionScripts.ts     # All transaction operations
├── allScripts.ts             # Master orchestration script
└── migrations/
    └── transactionMigrations.ts # Transaction migrations
```

### **Script Module Features**

Each script module follows a consistent pattern:

#### **1. Common Utilities**

```typescript
const validateUserId = (): string => {
  const userId = process.env.TEST_USER_ID;
  if (!userId) {
    throw new Error("TEST_USER_ID environment variable is required");
  }
  return userId;
};
```

#### **2. Exported Functions**

```typescript
export const createSingleBudget = async (): Promise<void> => {
  /* ... */
};
export const createBulkBudgets = async (): Promise<void> => {
  /* ... */
};
export const runAllBudgetOperations = async (): Promise<void> => {
  /* ... */
};
```

#### **3. Command Line Interface**

```typescript
if (require.main === module) {
  const operation = process.argv[2];
  switch (operation) {
    case "create":
      createSingleBudget();
      break;
    case "bulk":
      createBulkBudgets();
      break;
    case "all":
      runAllBudgetOperations();
      break;
    default: /* show usage */
  }
}
```

## Usage Examples

### **1. Budget Scripts**

```bash
# Individual operations
tsx src/scripts/budgetScripts.ts create    # Create single budget
tsx src/scripts/budgetScripts.ts bulk      # Create bulk budgets
tsx src/scripts/budgetScripts.ts list      # Get paginated budgets
tsx src/scripts/budgetScripts.ts all       # Run all budget operations
```

### **2. Income Scripts**

```bash
# Individual operations
tsx src/scripts/incomeScripts.ts create    # Create single income
tsx src/scripts/incomeScripts.ts bulk      # Create bulk incomes
tsx src/scripts/incomeScripts.ts all       # Run all income operations
```

### **3. Transaction Scripts**

```bash
# Individual operations
tsx src/scripts/transactionScripts.ts create   # Create sample transaction
tsx src/scripts/transactionScripts.ts expense  # Create expense transaction
tsx src/scripts/transactionScripts.ts income   # Create income transaction
tsx src/scripts/transactionScripts.ts all      # Run all transaction operations
```

### **4. Master Script (All Operations)**

```bash
# Orchestrated operations
tsx src/scripts/allScripts.ts data        # Run all data operations
tsx src/scripts/allScripts.ts migrations  # Run all migrations
tsx src/scripts/allScripts.ts demo        # Setup demo data only
tsx src/scripts/allScripts.ts all         # Run everything
```

### **5. Programmatic Usage**

```typescript
import {
  createBulkBudgets,
  runAllBudgetOperations,
} from "@/scripts/budgetScripts";
import { runAllIncomeOperations } from "@/scripts/incomeScripts";
import { setupDemoData } from "@/scripts/allScripts";

// Use individual functions
await createBulkBudgets();
await runAllIncomeOperations();

// Use orchestrated functions
await setupDemoData();
```

## NPM Scripts Integration

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "scripts:budgets": "tsx src/scripts/budgetScripts.ts",
    "scripts:incomes": "tsx src/scripts/incomeScripts.ts",
    "scripts:transactions": "tsx src/scripts/transactionScripts.ts",
    "scripts:migrations": "tsx src/scripts/migrations/transactionMigrations.ts",
    "scripts:all": "tsx src/scripts/allScripts.ts",
    "scripts:demo": "tsx src/scripts/allScripts.ts demo",
    "scripts:help": "tsx src/scripts/allScripts.ts"
  }
}
```

Usage with npm:

```bash
npm run scripts:budgets bulk
npm run scripts:incomes all
npm run scripts:demo
npm run scripts:all data
```

## Benefits Achieved

### **🎯 1. Code Consolidation**

| Aspect               | Before                        | After                     |
| -------------------- | ----------------------------- | ------------------------- |
| **Files**            | 6 individual files            | 4 domain-specific modules |
| **Code Duplication** | High (validation repeated 6x) | Low (shared utilities)    |
| **Lines of Code**    | ~400 lines total              | ~350 lines total          |
| **Maintenance**      | Update 6 files                | Update 1 domain file      |

### **🔧 2. Improved Organization**

#### **Before: Scattered by Operation Type**

```
createBudget.ts        # Create operation
createBulkBudgets.ts   # Bulk operation
getPaginatedBudgets.ts # Read operation
createIncome.ts        # Create operation
createBulkIncomes.ts   # Bulk operation
```

#### **After: Organized by Domain**

```
budgetScripts.ts       # All budget operations
incomeScripts.ts       # All income operations
transactionScripts.ts  # All transaction operations
```

### **🚀 3. Enhanced Functionality**

#### **Consistent Command Interface**

```bash
# All scripts follow same pattern
tsx [scriptName].ts [operation]
tsx budgetScripts.ts create
tsx incomeScripts.ts bulk
tsx transactionScripts.ts expense
```

#### **Master Orchestration**

```typescript
// Can run complex workflows
await setupDemoData(); // Budgets + Incomes only
await runAllDataOperations(); // Everything
await runEverything(); // Data + Migrations
```

#### **Better Error Handling**

```typescript
export const createBulkBudgets = async (): Promise<void> => {
  try {
    // Operation logic
  } catch (error) {
    console.error("Error creating bulk budgets:", error);
    throw error; // Re-throw for orchestration
  }
};
```

### **🧪 4. Improved Testability**

#### **Before: Hard to Test Scripts**

```typescript
// Had to run entire script files
// No way to test individual operations
```

#### **After: Testable Functions**

```typescript
import { createSingleBudget, createBulkBudgets } from "@/scripts/budgetScripts";

test("should create single budget", async () => {
  await createSingleBudget();
  // Test assertions
});

test("should create bulk budgets", async () => {
  await createBulkBudgets();
  // Test assertions
});
```

## Development Workflows

### **Setup Development Environment**

```bash
# 1. Setup demo data for development
npm run scripts:demo

# 2. Run specific operations as needed
npm run scripts:transactions expense
npm run scripts:budgets list
```

### **Testing Data Operations**

```bash
# Test individual domains
npm run scripts:budgets all
npm run scripts:incomes all
npm run scripts:transactions all

# Test everything together
npm run scripts:all data
```

### **Production Data Migrations**

```bash
# Run migrations only
npm run scripts:migrations all

# Or use the master script
npm run scripts:all migrations
```

## Script Module Details

### **budgetScripts.ts**

| Function                 | Purpose                      | Command  |
| ------------------------ | ---------------------------- | -------- |
| `createSingleBudget`     | Create one budget            | `create` |
| `createBulkBudgets`      | Create 49 sample budgets     | `bulk`   |
| `getPaginatedBudgets`    | List budgets with pagination | `list`   |
| `runAllBudgetOperations` | Run all budget operations    | `all`    |

### **incomeScripts.ts**

| Function                 | Purpose                         | Command  |
| ------------------------ | ------------------------------- | -------- |
| `createSingleIncome`     | Create one income source        | `create` |
| `createBulkIncomes`      | Create 50 sample income sources | `bulk`   |
| `runAllIncomeOperations` | Run all income operations       | `all`    |

### **transactionScripts.ts**

| Function                      | Purpose                        | Command   |
| ----------------------------- | ------------------------------ | --------- |
| `createSingleTransaction`     | Create sample transaction      | `create`  |
| `createExpenseTransaction`    | Create expense transaction     | `expense` |
| `createIncomeTransaction`     | Create income transaction      | `income`  |
| `runAllTransactionOperations` | Run all transaction operations | `all`     |

### **allScripts.ts**

| Function               | Purpose                      | Command      |
| ---------------------- | ---------------------------- | ------------ |
| `runAllDataOperations` | Run all data scripts         | `data`       |
| `runAllMigrations`     | Run all migrations           | `migrations` |
| `setupDemoData`        | Setup budgets + incomes only | `demo`       |
| `runEverything`        | Run everything               | `all`        |

## Environment Configuration

All scripts require the `TEST_USER_ID` environment variable:

```bash
# .env file
TEST_USER_ID=your-user-id-here
```

Or set it directly:

```bash
TEST_USER_ID=user123 tsx src/scripts/budgetScripts.ts all
```

## Error Handling Strategy

### **Individual Function Level**

```typescript
export const createSingleBudget = async (): Promise<void> => {
  try {
    // Operation logic
    console.log("Budget created successfully");
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error; // Re-throw for parent handling
  }
};
```

### **Orchestration Level**

```typescript
export const runAllBudgetOperations = async (): Promise<void> => {
  try {
    await createSingleBudget();
    await createBulkBudgets();
    await getPaginatedBudgets();
    console.log("All budget operations completed successfully");
  } catch (error) {
    console.error("Budget operations failed:", error);
    throw error;
  }
};
```

## Future Enhancements

### **1. Configuration-Driven Scripts**

```typescript
// Future enhancement: Configurable script data
const config = {
  budgets: { count: 10, categories: ["rent", "food"] },
  incomes: { count: 5, types: ["salary", "freelance"] },
};

await createConfigurableBulkData(config);
```

### **2. Interactive Script Mode**

```typescript
// Future enhancement: Interactive prompts
const operation = await promptUser("Select operation:", [
  "create",
  "bulk",
  "list",
]);
const count = await promptUser("How many items?", "number");
```

### **3. Performance Monitoring**

```typescript
// Future enhancement: Performance tracking
const startTime = Date.now();
await runAllDataOperations();
console.log(`Operations completed in ${Date.now() - startTime}ms`);
```

## Migration from Old Scripts

If you have references to old script files:

### **Before (Remove these)**

```bash
tsx src/scripts/createBudget.ts
tsx src/scripts/createBulkBudgets.ts
tsx src/scripts/getPaginatedBudgets.ts
tsx src/scripts/createIncome.ts
tsx src/scripts/createBulkIncomes.ts
tsx src/scripts/createTransaction.ts
```

### **After (Use these instead)**

```bash
tsx src/scripts/budgetScripts.ts create
tsx src/scripts/budgetScripts.ts bulk
tsx src/scripts/budgetScripts.ts list
tsx src/scripts/incomeScripts.ts create
tsx src/scripts/incomeScripts.ts bulk
tsx src/scripts/transactionScripts.ts create
```

## Conclusion

The script architecture refactoring successfully:

✅ **Consolidates Related Operations**: Domain-specific organization  
✅ **Eliminates Code Duplication**: Shared utilities and patterns  
✅ **Improves Maintainability**: Fewer files, consistent structure  
✅ **Enhances Usability**: Consistent command interface  
✅ **Enables Orchestration**: Master scripts for complex workflows  
✅ **Supports Testing**: Exportable, testable functions  
✅ **Maintains Flexibility**: Individual and bulk operations available

This architecture makes script management more organized, maintainable, and scalable for future development needs.
