# Zod Validation in Repository Layer

## Why Parse Firebase Documents with Zod?

### The Problem: Unsafe Type Casting

**Before:**

```typescript
// ❌ Dangerous - blindly trusting external data
const budget = entityDoc.data() as BudgetModel;
```

**Issues:**

- No runtime validation
- Silent failures with corrupted data
- Difficult debugging
- Type safety only at compile time

### The Solution: Runtime Validation

**After:**

```typescript
// ✅ Safe - validated at runtime
const budget = budgetModelSchema.parse(entityDoc.data());
```

## Real-World Scenarios This Protects Against

### 1. **Database Migration Issues**

```typescript
// Scenario: Field type changed but old documents exist
// Old document: { maximumSpending: "100.50" } // string
// New schema expects: { maximumSpending: 100.50 } // number

// Without Zod: Silent bug, calculations fail
const budget = doc.data() as BudgetModel;
const remaining = budget.maximumSpending - spent; // NaN!

// With Zod: Clear error message
try {
  const budget = budgetModelSchema.parse(doc.data());
} catch (error) {
  // Error: "maximumSpending: Expected number, received string"
}
```

### 2. **Corrupted Data**

```typescript
// Scenario: Document missing required fields
// Document: { id: "123", name: "Food" } // missing maximumSpending

// Without Zod: Runtime crash later
const budget = doc.data() as BudgetModel;
const percentage = (spent / budget.maximumSpending) * 100; // Crash!

// With Zod: Immediate validation error
try {
  const budget = budgetModelSchema.parse(doc.data());
} catch (error) {
  // Error: "maximumSpending: Required"
}
```

### 3. **Timestamp Conversion Issues**

```typescript
// Scenario: Different timestamp formats from different sources
// Document: { createdAt: "2024-01-15T10:30:00Z" } // ISO string
// Expected: Firestore Timestamp object

// Without Zod: Type error or conversion issues
const budget = doc.data() as BudgetModel;
const date = budget.createdAt.toDate(); // Method doesn't exist on string!

// With Zod: Automatic conversion and validation
const budget = budgetModelSchema.parse(doc.data());
const date = budget.createdAt.toDate(); // Works! Converted to Timestamp
```

## Implementation Benefits

### 1. **Better Error Messages**

```typescript
// Zod provides detailed validation paths
{
  "code": "invalid_type",
  "expected": "number",
  "received": "string",
  "path": ["maximumSpending"],
  "message": "Expected number, received string"
}

// Our enhanced error handler provides context:
"BudgetRepository data validation failed (Document ID: abc123): maximumSpending: Expected number, received string"
```

### 2. **Data Transformation**

```typescript
// zTimestamp utility automatically handles different formats:
export const zTimestamp = z
  .custom<Timestamp>((value) => {
    if (value instanceof Timestamp) return true;
    if (typeof value === "number" && value > 0) return true;
    if (typeof value === "string" && !isNaN(Date.parse(value))) return true;
    return false;
  })
  .transform((value) => {
    if (typeof value === "number") {
      const seconds = value > 1e12 ? Math.floor(value / 1000) : value;
      return new Timestamp(seconds, 0);
    }
    if (typeof value === "string") {
      return Timestamp.fromDate(new Date(value));
    }
    return value; // Already a Timestamp
  });
```

### 3. **Fail-Fast Principle**

```typescript
// Validation happens immediately when data is retrieved
// rather than failing later during business logic execution

async getById(userId: string, entityId: string): Promise<TDto | null> {
  const entityDoc = await this.getEntityCollection(userId).doc(entityId).get();

  if (!entityDoc.exists) return null;

  // ✅ Validation happens here - fail fast!
  const validatedData = this.parseDocumentData(entityDoc.data(), entityId);
  return this.mapModelToDto(validatedData);
}
```

## Performance Considerations

### Minimal Overhead

- Zod parsing is very fast for simple objects
- Validation happens only when data is retrieved
- Better than runtime crashes in production

### Caching Benefits

```typescript
// Valid data is guaranteed to be type-safe
// Can be safely cached without re-validation
const validatedBudget = budgetModelSchema.parse(rawData);
// Now safe to cache, transform, etc.
```

## Development Experience Improvements

### 1. **IDE Support**

```typescript
// After Zod validation, full TypeScript inference works
const budget = budgetModelSchema.parse(doc.data());
budget.maximumSpending; // Full autocomplete and type checking
```

### 2. **Testing Benefits**

```typescript
// Easy to test with invalid data
test("should handle corrupted budget data", async () => {
  const corruptedDoc = { id: "123", name: "Food" }; // missing maximumSpending

  await expect(
    budgetRepository.parseDocumentData(corruptedDoc)
  ).rejects.toThrow("maximumSpending: Required");
});
```

### 3. **Debugging**

```typescript
// Clear error trails when data issues occur
Error: BudgetRepository data validation failed (Document ID: budget_xyz):
  maximumSpending: Expected number, received string,
  colorTag: Expected string, received undefined
```

## Migration Strategy

### Phase 1: Add Validation (✅ Completed)

- Enhanced BaseRepository with `parseDocumentData`
- Updated TransactionRepository for complex cases
- No breaking changes to existing APIs

### Phase 2: Monitor and Improve

```typescript
// Add monitoring for validation failures
protected parseDocumentData(rawData: unknown, docId?: string): TModel {
  try {
    return this.modelSchema.parse(rawData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log validation failures for monitoring
      logger.warn('Data validation failed', {
        repository: this.contextName,
        docId,
        errors: error.errors
      });

      // Still throw for fail-fast behavior
      const errorDetails = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');

      const context = docId ? ` (Document ID: ${docId})` : '';
      throw new Error(
        `${this.contextName} data validation failed${context}: ${errorDetails}`
      );
    }
    throw error;
  }
}
```

### Phase 3: Gradual Schema Evolution

```typescript
// Can safely evolve schemas with proper migrations
export const budgetModelSchema = budgetSchema
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
    // New fields with safe defaults
    version: z.number().default(1),
    tags: z.array(z.string()).default([]),
  });
```

## Conclusion

Parsing Firebase documents with Zod provides:

✅ **Runtime Type Safety** - Catch data issues immediately  
✅ **Better Error Messages** - Clear debugging information  
✅ **Data Transformation** - Automatic type conversion  
✅ **Fail-Fast Behavior** - Prevent corrupted data propagation  
✅ **Development Experience** - Better IDE support and testing  
✅ **Future-Proof** - Easy schema evolution and migration

This is a **critical best practice** for any application dealing with external data sources.
