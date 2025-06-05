import { TransactionModel } from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { debugLog } from "@/utils/debugLog";
import { CollectionService } from "./CollectionService";
import { FirestoreService } from "./FirestoreService";
import { UtilityService } from "./UtilityService";

export class TransactionMigrationService {
  private readonly firestoreService: FirestoreService;
  private readonly collectionService: CollectionService;
  private readonly utilityService: UtilityService;
  private readonly contextName = "TransactionMigrationService";

  constructor() {
    this.firestoreService = new FirestoreService();
    this.collectionService = new CollectionService();
    this.utilityService = new UtilityService();
  }

  private calculateSignedAmount(amount: number, type: string): number {
    return type === "income" ? amount : -amount;
  }

  /**
   * Migrate transaction categories to separate collection
   * This migration extracts categories from transaction documents
   * and creates them as separate documents in a categories collection
   */
  async migrateTransactionCategoriesToCollection(): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        const batch = adminFirestore.batch();
        const usersSnapshot = await this.collectionService
          .getUserCollection()
          .get();

        if (usersSnapshot.empty) {
          debugLog(
            this.contextName,
            "migrateCategoriesToCollection: No users found - nothing to migrate"
          );
          return;
        }

        for (const userDoc of usersSnapshot.docs) {
          await this.migrateUserCategories(userDoc.id, batch);
        }

        await batch.commit();
        debugLog(
          this.contextName,
          "migrateCategoriesToCollection: Category migration completed for all users"
        );
      },
      this.contextName,
      "Failed to migrate transaction categories to collection"
    );
  }

  /**
   * Migrate transaction amounts to include signed amounts
   * This migration adds a signedAmount field to existing transactions
   * where income is positive and expense is negative
   */
  async migrateTransactionAmountsToSignedAmounts(): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        const batch = adminFirestore.batch();
        const usersSnapshot = await this.collectionService
          .getUserCollection()
          .get();

        if (usersSnapshot.empty) {
          debugLog(
            this.contextName,
            "migrateAmountsToSignedAmounts: No users found - nothing to migrate"
          );
          return;
        }

        for (const userDoc of usersSnapshot.docs) {
          await this.migrateUserTransactionAmounts(userDoc.id, batch);
        }

        await batch.commit();
        debugLog(
          this.contextName,
          "migrateAmountsToSignedAmounts: Migration completed for all users"
        );
      },
      this.contextName,
      "Failed to migrate transaction amounts to signed amounts"
    );
  }

  /**
   * Synchronize categories collection with transactions
   * This migration removes categories that have no corresponding transactions
   * by comparing category document IDs with category.id field in transactions
   */
  async synchronizeCategoriesWithTransactions(): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        const batch = adminFirestore.batch();
        const usersSnapshot = await this.collectionService
          .getUserCollection()
          .get();

        if (usersSnapshot.empty) {
          debugLog(
            this.contextName,
            "synchronizeCategoriesWithTransactions: No users found - nothing to synchronize"
          );
          return;
        }

        let totalDeletedCategories = 0;

        for (const userDoc of usersSnapshot.docs) {
          const deletedCount = await this.synchronizeUserCategories(
            userDoc.id,
            batch
          );
          totalDeletedCategories += deletedCount;
        }

        await batch.commit();
        debugLog(
          this.contextName,
          `synchronizeCategoriesWithTransactions: Synchronization completed. Deleted ${totalDeletedCategories} orphaned categories across all users`
        );
      },
      this.contextName,
      "Failed to synchronize categories with transactions"
    );
  }

  private async migrateUserCategories(
    userId: string,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<void> {
    const transactionsRef =
      this.collectionService.getTransactionCollection(userId);
    const categoriesRef = this.collectionService.getCategoryCollection(userId);
    const transactionsSnapshot = await transactionsRef.get();

    if (transactionsSnapshot.empty) {
      debugLog(
        this.contextName,
        `migrateUserCategories: No transactions found for user ${userId} - skipping`
      );
      return;
    }

    const uniqueCategories = new Map();
    const timestamp = this.firestoreService.getCurrentTimestamp();

    transactionsSnapshot.forEach((transactionDoc) => {
      const transaction = transactionDoc.data() as TransactionModel;
      const category = transaction.category;

      if (category && !uniqueCategories.has(category.id)) {
        uniqueCategories.set(category.id, {
          ...category,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    });

    if (uniqueCategories.size === 0) {
      debugLog(
        this.contextName,
        `migrateUserCategories: No categories found in transactions for user ${userId} - skipping`
      );
      return;
    }

    uniqueCategories.forEach((category, categoryId) => {
      const categoryRef = categoriesRef.doc(categoryId);
      batch.set(categoryRef, category);
    });

    debugLog(
      this.contextName,
      `migrateUserCategories: Migrated ${uniqueCategories.size} categories for user ${userId}`
    );
  }

  private async migrateUserTransactionAmounts(
    userId: string,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<void> {
    const transactionsRef =
      this.collectionService.getTransactionCollection(userId);
    const transactionsSnapshot = await transactionsRef.get();

    if (transactionsSnapshot.empty) {
      debugLog(
        this.contextName,
        `migrateUserAmounts: No transactions found for user ${userId} - skipping`
      );
      return;
    }

    let migratedCount = 0;
    transactionsSnapshot.forEach((transactionDoc) => {
      const transaction = transactionDoc.data() as TransactionModel;

      // Only migrate if signedAmount doesn't exist
      if (transaction.signedAmount === undefined) {
        const signedAmount = this.calculateSignedAmount(
          transaction.amount,
          transaction.type
        );
        batch.update(transactionDoc.ref, { signedAmount });
        migratedCount++;
      }
    });

    debugLog(
      this.contextName,
      `migrateUserAmounts: Migrated ${migratedCount} transactions for user ${userId}`
    );
  }

  private async synchronizeUserCategories(
    userId: string,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<number> {
    const categoriesRef = this.collectionService.getCategoryCollection(userId);
    const transactionsRef =
      this.collectionService.getTransactionCollection(userId);

    const [categoriesSnapshot, transactionsSnapshot] = await Promise.all([
      categoriesRef.get(),
      transactionsRef.get(),
    ]);

    if (categoriesSnapshot.empty) {
      debugLog(
        this.contextName,
        `synchronizeUserCategories: No categories found for user ${userId} - skipping`
      );
      return 0;
    }

    // Get all category IDs referenced in transactions
    const referencedCategoryIds = new Set<string>();
    transactionsSnapshot.forEach((transactionDoc) => {
      const transaction = transactionDoc.data() as TransactionModel;
      if (transaction.category?.id) {
        referencedCategoryIds.add(transaction.category.id);
      }
    });

    // Find orphaned categories and mark them for deletion
    let deletedCount = 0;
    categoriesSnapshot.forEach((categoryDoc) => {
      const categoryId = categoryDoc.id;
      if (!referencedCategoryIds.has(categoryId)) {
        batch.delete(categoryDoc.ref);
        deletedCount++;
      }
    });

    debugLog(
      this.contextName,
      `synchronizeUserCategories: Found ${deletedCount} orphaned categories for user ${userId}`
    );

    return deletedCount;
  }
}
