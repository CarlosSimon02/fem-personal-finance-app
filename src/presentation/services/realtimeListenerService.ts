import { PaginationParams } from "@/core/schemas/paginationSchema";
import { clientFirestore } from "@/services/firebase/firebaseClient";
import {
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  where,
} from "firebase/firestore";

export type EntityType =
  | "transactions"
  | "budgets"
  | "incomes"
  | "categories"
  | "pots";

export interface RealtimeListenerConfig<T = unknown> {
  userId: string;
  entityType: EntityType;
  onData: (data: T[]) => void;
  onError: (error: Error) => void;
}

export class RealtimeListenerService {
  private static instance: RealtimeListenerService;
  private activeListeners: Map<string, Unsubscribe> = new Map();

  private constructor() {}

  static getInstance(): RealtimeListenerService {
    if (!RealtimeListenerService.instance) {
      RealtimeListenerService.instance = new RealtimeListenerService();
    }
    return RealtimeListenerService.instance;
  }

  private getCollectionPath(userId: string, entityType: EntityType): string {
    return `users/${userId}/${entityType}`;
  }

  private buildQueryConstraints(params: PaginationParams): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    // Add filters
    if (params.filters && params.filters.length > 0) {
      params.filters.forEach((filter) => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    }

    // Add search filter for name field
    if (params.search) {
      constraints.push(where("name", ">=", params.search));
      constraints.push(where("name", "<=", params.search + "\uf8ff"));
    }

    // Add ordering
    constraints.push(orderBy(params.sort.field, params.sort.order));

    // Add limit
    constraints.push(limit(params.pagination.limitPerPage));

    return constraints;
  }

  private generateListenerKey<T>(config: RealtimeListenerConfig<T>): string {
    return `${config.entityType}_${config.userId}`;
  }

  private processSnapshot<T extends Record<string, unknown>>(
    snapshot: QuerySnapshot<DocumentData>,
    entityType: EntityType
  ): T[] {
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to Date objects for consistency
        ...(data.createdAt && {
          createdAt: data.createdAt.toDate(),
        }),
        ...(data.updatedAt && {
          updatedAt: data.updatedAt.toDate(),
        }),
        // Handle transaction-specific date field
        ...(entityType === "transactions" &&
          data.transactionDate && {
            transactionDate: data.transactionDate.toDate(),
          }),
      } as T;
    });
  }

  subscribe<T extends Record<string, unknown>>(
    config: RealtimeListenerConfig<T>
  ): () => void {
    const listenerKey = this.generateListenerKey(config);

    // If listener already exists, unsubscribe first
    if (this.activeListeners.has(listenerKey)) {
      this.unsubscribe(listenerKey);
    }

    try {
      const collectionPath = this.getCollectionPath(
        config.userId,
        config.entityType
      );
      const collectionRef = collection(clientFirestore, collectionPath);
      const firestoreQuery = query(collectionRef);

      const unsubscribe = onSnapshot(
        firestoreQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
          try {
            const data = this.processSnapshot<T>(snapshot, config.entityType);
            config.onData(data);
          } catch (error) {
            console.error(
              `Error processing ${config.entityType} snapshot:`,
              error
            );
            config.onError(error as Error);
          }
        },
        (error) => {
          console.error(`Error in ${config.entityType} listener:`, error);
          config.onError(error);
        }
      );

      this.activeListeners.set(listenerKey, unsubscribe);

      // Return cleanup function
      return () => this.unsubscribe(listenerKey);
    } catch (error) {
      console.error(`Failed to create ${config.entityType} listener:`, error);
      config.onError(error as Error);
      return () => {};
    }
  }

  unsubscribe(listenerKey: string): void {
    const unsubscribe = this.activeListeners.get(listenerKey);
    if (unsubscribe) {
      unsubscribe();
      this.activeListeners.delete(listenerKey);
    }
  }

  unsubscribeAll(): void {
    this.activeListeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.activeListeners.clear();
  }

  getActiveListenersCount(): number {
    return this.activeListeners.size;
  }
}
