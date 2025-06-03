# Migration Quick Reference

## Quick Commands

### **Direct Execution**

```bash
# Run all migrations
tsx src/scripts/migrations/transactionMigrations.ts all

# Run category migration only
tsx src/scripts/migrations/transactionMigrations.ts categories

# Run signed amount migration only
tsx src/scripts/migrations/transactionMigrations.ts signed-amounts

# Show help
tsx src/scripts/migrations/transactionMigrations.ts
```

### **NPM Scripts** (Add to package.json)

```json
{
  "scripts": {
    "migrate:all": "tsx src/scripts/migrations/transactionMigrations.ts all",
    "migrate:categories": "tsx src/scripts/migrations/transactionMigrations.ts categories",
    "migrate:amounts": "tsx src/scripts/migrations/transactionMigrations.ts signed-amounts"
  }
}
```

```bash
npm run migrate:all
npm run migrate:categories
npm run migrate:amounts
```

## Migration Types

| Migration          | Purpose                                                             | Command          |
| ------------------ | ------------------------------------------------------------------- | ---------------- |
| **Categories**     | Extract categories from transactions to separate collection         | `categories`     |
| **Signed Amounts** | Add signedAmount field (positive for income, negative for expenses) | `signed-amounts` |
| **All**            | Run both migrations in sequence                                     | `all`            |

## Pre-flight Checklist

- [ ] Firebase admin credentials configured
- [ ] Database backup created (production)
- [ ] Tested in staging environment
- [ ] Team notified (production)

## Common Issues

| Issue             | Solution                          |
| ----------------- | --------------------------------- |
| Permission denied | Check Firebase credentials        |
| Module not found  | Verify tsconfig.json path mapping |
| Network timeout   | Check Firestore quotas            |

## Environment Variables

```bash
# Production migration
NODE_ENV=production tsx src/scripts/migrations/transactionMigrations.ts all
```

For detailed instructions, see [MIGRATION_ARCHITECTURE.md](./MIGRATION_ARCHITECTURE.md)
