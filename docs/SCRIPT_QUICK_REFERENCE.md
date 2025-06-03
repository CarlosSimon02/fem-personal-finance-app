# Script Quick Reference

## Quick Commands

### **Budget Scripts**

```bash
tsx src/scripts/budgetScripts.ts create    # Create single budget
tsx src/scripts/budgetScripts.ts bulk      # Create 49 sample budgets
tsx src/scripts/budgetScripts.ts list      # Get paginated budgets
tsx src/scripts/budgetScripts.ts all       # Run all budget operations
```

### **Income Scripts**

```bash
tsx src/scripts/incomeScripts.ts create    # Create single income
tsx src/scripts/incomeScripts.ts bulk      # Create 50 sample incomes
tsx src/scripts/incomeScripts.ts all       # Run all income operations
```

### **Transaction Scripts**

```bash
tsx src/scripts/transactionScripts.ts create   # Create sample transaction
tsx src/scripts/transactionScripts.ts expense  # Create expense transaction
tsx src/scripts/transactionScripts.ts income   # Create income transaction
tsx src/scripts/transactionScripts.ts all      # Run all transaction operations
```

### **Migration Scripts**

```bash
tsx src/scripts/migrations/transactionMigrations.ts categories     # Migrate categories
tsx src/scripts/migrations/transactionMigrations.ts signed-amounts # Migrate amounts
tsx src/scripts/migrations/transactionMigrations.ts all            # Run all migrations
```

### **Master Scripts**

```bash
tsx src/scripts/allScripts.ts data        # Run all data operations
tsx src/scripts/allScripts.ts migrations  # Run all migrations
tsx src/scripts/allScripts.ts demo        # Setup demo data (budgets + incomes)
tsx src/scripts/allScripts.ts all         # Run everything
```

## NPM Scripts (Recommended)

Add to your `package.json`:

```json
{
  "scripts": {
    "scripts:budgets": "tsx src/scripts/budgetScripts.ts",
    "scripts:incomes": "tsx src/scripts/incomeScripts.ts",
    "scripts:transactions": "tsx src/scripts/transactionScripts.ts",
    "scripts:migrations": "tsx src/scripts/migrations/transactionMigrations.ts",
    "scripts:demo": "tsx src/scripts/allScripts.ts demo",
    "scripts:all": "tsx src/scripts/allScripts.ts"
  }
}
```

Usage:

```bash
npm run scripts:budgets bulk
npm run scripts:demo
npm run scripts:all data
```

## Common Workflows

| Workflow                   | Commands                                   |
| -------------------------- | ------------------------------------------ |
| **Setup Demo Environment** | `tsx src/scripts/allScripts.ts demo`       |
| **Create Sample Data**     | `tsx src/scripts/allScripts.ts data`       |
| **Run Migrations**         | `tsx src/scripts/allScripts.ts migrations` |
| **Do Everything**          | `tsx src/scripts/allScripts.ts all`        |

## Script Organization

| Domain           | Script File                           | Operations                      |
| ---------------- | ------------------------------------- | ------------------------------- |
| **Budgets**      | `budgetScripts.ts`                    | create, bulk, list, all         |
| **Incomes**      | `incomeScripts.ts`                    | create, bulk, all               |
| **Transactions** | `transactionScripts.ts`               | create, expense, income, all    |
| **Migrations**   | `migrations/transactionMigrations.ts` | categories, signed-amounts, all |
| **Master**       | `allScripts.ts`                       | data, migrations, demo, all     |

## Environment Setup

Required environment variable:

```bash
TEST_USER_ID=your-user-id-here
```

Or set inline:

```bash
TEST_USER_ID=user123 tsx src/scripts/budgetScripts.ts all
```

## Help Commands

```bash
tsx src/scripts/budgetScripts.ts          # Show budget help
tsx src/scripts/incomeScripts.ts           # Show income help
tsx src/scripts/transactionScripts.ts      # Show transaction help
tsx src/scripts/allScripts.ts              # Show master help
```

For detailed documentation, see [SCRIPT_ARCHITECTURE.md](./SCRIPT_ARCHITECTURE.md)
