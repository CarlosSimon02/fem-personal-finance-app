import { adminFirestore } from "@/services/firebase/firebaseAdmin";

/**
 * Generic Batch Operation Service for Firestore operations
 *
 * This service provides a fluent interface for batching multiple Firestore operations
 * and executing them atomically. It supports create, update, delete operations with
 * conditional logic.
 *
 * @example Basic Usage:
 * ```typescript
 * const batchService = new BatchOperationService();
 *
 * // Add operations
 * batchService
 *   .set(docRef1, { name: "John", age: 30 })
 *   .update(docRef2, { status: "active" })
 *   .delete(docRef3);
 *
 * // Execute all operations atomically
 * await batchService.commit();
 * ```
 *
 * @example Conditional Operations:
 * ```typescript
 * const batchService = new BatchOperationService();
 *
 * // Only create if document doesn't exist
 * await batchService.setIfNotExists(docRef, { name: "New User" });
 *
 * // Only delete if condition is met
 * batchService.conditionalDelete(docRef, shouldDelete);
 *
 * await batchService.commit();
 * ```
 *
 * @example Extending for Specific Use Cases:
 * ```typescript
 * class UserBatchService extends BatchOperationService {
 *   addUserCreate(ref: DocumentReference, userData: UserModel): UserBatchService {
 *     this.set(ref, userData);
 *     return this;
 *   }
 *
 *   addUserUpdate(ref: DocumentReference, updates: Partial<UserModel>): UserBatchService {
 *     this.update(ref, updates);
 *     return this;
 *   }
 * }
 */
export class BatchOperationService {
  private batch = adminFirestore.batch();

  /**
   * Generic set operation for creating documents
   * @param ref - Firestore document reference
   * @param data - Document data to set
   * @returns BatchOperationService instance for chaining
   */
  set<T extends Record<string, unknown>>(
    ref: FirebaseFirestore.DocumentReference,
    data: T
  ): BatchOperationService {
    this.batch.set(ref, data);
    return this;
  }

  /**
   * Generic update operation for updating documents
   * @param ref - Firestore document reference
   * @param data - Partial data to update
   * @returns BatchOperationService instance for chaining
   */
  update(
    ref: FirebaseFirestore.DocumentReference,
    data: { [key: string]: any }
  ): BatchOperationService {
    this.batch.update(ref, data);
    return this;
  }

  /**
   * Generic delete operation
   * @param ref - Firestore document reference
   * @returns BatchOperationService instance for chaining
   */
  delete(ref: FirebaseFirestore.DocumentReference): BatchOperationService {
    this.batch.delete(ref);
    return this;
  }

  /**
   * Conditional set - only sets if document doesn't exist
   * @param ref - Firestore document reference
   * @param data - Document data to set
   * @returns Promise<BatchOperationService> for chaining
   */
  async setIfNotExists<T extends Record<string, unknown>>(
    ref: FirebaseFirestore.DocumentReference,
    data: T
  ): Promise<BatchOperationService> {
    const doc = await ref.get();
    if (!doc.exists) {
      this.batch.set(ref, data);
    }
    return this;
  }

  /**
   * Conditional delete - only deletes if condition is met
   * @param ref - Firestore document reference
   * @param condition - Boolean condition to determine if delete should occur
   * @returns BatchOperationService instance for chaining
   */
  conditionalDelete(
    ref: FirebaseFirestore.DocumentReference,
    condition: boolean
  ): BatchOperationService {
    if (condition) {
      this.batch.delete(ref);
    }
    return this;
  }

  /**
   * Execute all batched operations atomically
   * @returns Promise that resolves when all operations are complete
   */
  async commit(): Promise<void> {
    await this.batch.commit();
  }

  /**
   * Get the current batch size (useful for checking Firestore's 500 operation limit)
   * @returns Number of operations currently in the batch
   */
  getBatchSize(): number {
    return (this.batch as any)._ops?.length || 0;
  }

  /**
   * Reset the batch (useful for reusing the service)
   * @returns BatchOperationService instance for chaining
   */
  reset(): BatchOperationService {
    this.batch = adminFirestore.batch();
    return this;
  }
}
