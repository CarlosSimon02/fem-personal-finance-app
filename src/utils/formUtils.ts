/**
 * Utility functions for form data processing and optimization
 */

/**
 * Generic function to compare two objects and return only the changed fields
 * Useful for optimizing API calls by sending only modified data
 *
 * @param initialData - The original data object
 * @param newData - The new data object to compare against
 * @param customComparisons - Optional custom comparison functions for specific fields
 * @returns Object containing only the changed fields
 *
 * @example
 * ```typescript
 * const changes = getChangedFields(
 *   { name: "John", age: 30, email: "john@example.com" },
 *   { name: "John", age: 31, email: "john@example.com" }
 * );
 * // Result: { age: 31 }
 * ```
 */
export const getChangedFields = <T extends Record<string, any>>(
  initialData: Record<string, any>,
  newData: T,
  customComparisons?: Record<string, (initial: any, current: any) => boolean>
): Partial<T> => {
  const changes: Partial<T> = {};

  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      const newValue = newData[key];
      let hasChanged = false;

      if (customComparisons && customComparisons[key]) {
        // Use custom comparison function
        hasChanged = customComparisons[key](initialData, newData);
      } else {
        // Default comparison
        const initialValue = initialData[key];
        hasChanged = !isEqual(newValue, initialValue);
      }

      if (hasChanged) {
        changes[key] = newValue;
      }
    }
  }

  return changes;
};

/**
 * Deep equality comparison function
 * Handles primitive values, dates, arrays, and objects
 */
const isEqual = (a: any, b: any): boolean => {
  // Same reference or both null/undefined
  if (a === b) return true;

  // One is null/undefined, the other is not
  if (a == null || b == null) return a === b;

  // Different types
  if (typeof a !== typeof b) return false;

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  // Object comparison
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key])
    );
  }

  // Primitive comparison
  return a === b;
};

/**
 * Transaction-specific field comparison utility
 * Handles the specific comparison logic for transaction data
 */
export const getTransactionChangedFields = (
  initialData: {
    name: string;
    type: string;
    amount: number;
    recipientOrPayer: string | null;
    category: { id: string };
    transactionDate: Date;
    description: string | null;
    emoji: string;
  },
  formData: {
    name: string;
    type: string;
    amount: number;
    recipientOrPayer: string | null;
    categoryId: string;
    transactionDate: Date;
    description: string | null;
    emoji: string;
  }
) => {
  return getChangedFields(initialData, formData, {
    categoryId: (initial, current) =>
      current.categoryId !== initial.category.id,
    transactionDate: (initial, current) =>
      current.transactionDate.getTime() !== initial.transactionDate.getTime(),
  });
};

/**
 * Checks if an object has any properties (useful for checking if there are changes)
 */
export const hasChanges = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length > 0;
};

/**
 * Formats changed fields for logging/debugging purposes
 */
export const formatChanges = (changes: Record<string, any>): string => {
  const changeList = Object.entries(changes)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(", ");

  return `Changed fields: ${changeList}`;
};
