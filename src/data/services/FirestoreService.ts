import {
  createPaginationResponseSchema,
  PaginationParams,
} from "@/core/schemas/paginationSchema";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { UtilityService } from "./UtilityService";

export interface EntityData {
  id: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  [key: string]: any;
}

export interface FirestoreConfig {
  contextName: string;
  collectionName: string;
}

export class FirestoreService {
  private utilityService: UtilityService;

  constructor() {
    this.utilityService = new UtilityService();
  }

  private getUserCollection() {
    return adminFirestore.collection("users");
  }

  private getEntityCollection(userId: string, collectionName: string) {
    return this.getUserCollection().doc(userId).collection(collectionName);
  }

  getCurrentTimestamp() {
    return FieldValue.serverTimestamp();
  }

  /**
   * Create entity in Firestore
   * @param userId - User ID
   * @param data - Entity data to create
   * @param config - Firestore configuration
   * @returns Created document reference
   */
  async create(
    userId: string,
    data: Omit<EntityData, "id" | "createdAt" | "updatedAt">,
    config: FirestoreConfig
  ): Promise<FirebaseFirestore.DocumentSnapshot> {
    return this.utilityService.executeOperation(
      async () => {
        const id = this.utilityService.generateId();
        const entityRef = this.getEntityCollection(
          userId,
          config.collectionName
        ).doc(id);
        const timestamp = this.getCurrentTimestamp();

        const entityData: EntityData = {
          ...data,
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await entityRef.set(entityData);
        const entityDoc = await entityRef.get();

        if (!entityDoc.exists) {
          throw new Error(
            `Failed to retrieve created ${config.collectionName.slice(0, -1)}`
          );
        }

        return entityDoc;
      },
      config.contextName,
      `Failed to create ${config.collectionName.slice(0, -1)}`
    );
  }

  /**
   * Get entity by ID
   * @param userId - User ID
   * @param entityId - Entity ID
   * @param config - Firestore configuration
   * @returns Document snapshot or null if not found
   */
  async getById(
    userId: string,
    entityId: string,
    config: FirestoreConfig
  ): Promise<FirebaseFirestore.DocumentSnapshot | null> {
    return this.utilityService.executeOperation(
      async () => {
        const entityDoc = await this.getEntityCollection(
          userId,
          config.collectionName
        )
          .doc(entityId)
          .get();

        return entityDoc.exists ? entityDoc : null;
      },
      config.contextName,
      `Failed to get ${config.collectionName.slice(0, -1)}`
    );
  }

  /**
   * Get paginated entities
   * @param userId - User ID
   * @param params - Pagination parameters
   * @param schema - Zod schema for validation
   * @param config - Firestore configuration
   * @returns Paginated data and metadata
   */
  async getPaginated<T>(
    userId: string,
    params: PaginationParams,
    schema: z.ZodType<T>,
    config: FirestoreConfig
  ): Promise<{ data: T[]; meta: any }> {
    return this.utilityService.executeOperation(
      async () => {
        const response = await this.getPaginatedData(
          this.getEntityCollection(userId, config.collectionName),
          params,
          schema
        );

        return response;
      },
      config.contextName,
      `Failed to get paginated ${config.collectionName}`
    );
  }

  /**
   * Update entity
   * @param userId - User ID
   * @param entityId - Entity ID
   * @param updateData - Data to update
   * @param config - Firestore configuration
   * @returns Updated document snapshot
   */
  async update(
    userId: string,
    entityId: string,
    updateData: Partial<EntityData>,
    config: FirestoreConfig
  ): Promise<FirebaseFirestore.DocumentSnapshot> {
    return this.utilityService.executeOperation(
      async () => {
        const entityRef = this.getEntityCollection(
          userId,
          config.collectionName
        ).doc(entityId);
        const timestamp = this.getCurrentTimestamp();

        const data = {
          ...updateData,
          updatedAt: timestamp,
        };

        await entityRef.update(data);
        const entityDoc = await entityRef.get();

        if (!entityDoc.exists) {
          throw new Error(
            `${config.collectionName.slice(0, -1)} not found after update`
          );
        }

        return entityDoc;
      },
      config.contextName,
      `Failed to update ${config.collectionName.slice(0, -1)}`
    );
  }

  /**
   * Delete entity
   * @param userId - User ID
   * @param entityId - Entity ID
   * @param config - Firestore configuration
   */
  async delete(
    userId: string,
    entityId: string,
    config: FirestoreConfig
  ): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await this.getEntityCollection(userId, config.collectionName)
          .doc(entityId)
          .delete();
      },
      config.contextName,
      `Failed to delete ${config.collectionName.slice(0, -1)}`
    );
  }

  /**
   * Check if entity exists by name
   * @param userId - User ID
   * @param name - Entity name
   * @param config - Firestore configuration
   * @returns True if entity exists
   */
  async existsByName(
    userId: string,
    name: string,
    config: FirestoreConfig
  ): Promise<boolean> {
    return this.utilityService.executeOperation(
      async () => {
        const querySnapshot = await this.getEntityCollection(
          userId,
          config.collectionName
        )
          .where("name", "==", name)
          .limit(1)
          .get();

        return !querySnapshot.empty;
      },
      config.contextName,
      `Failed to check if ${config.collectionName.slice(0, -1)} exists`
    );
  }

  /**
   * Get collection reference for advanced operations
   * @param userId - User ID
   * @param collectionName - Collection name
   * @returns Firestore collection reference
   */
  getCollection(userId: string, collectionName: string) {
    return this.getEntityCollection(userId, collectionName);
  }

  /**
   * Get paginated data
   * @param collection - Firestore collection reference
   * @param params - Pagination parameters
   * @param dataSchema - Zod schema for validation
   * @returns Paginated data and metadata
   */
  async getPaginatedData<T extends z.ZodTypeAny>(
    collection: FirebaseFirestore.CollectionReference<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >,
    params: PaginationParams,
    dataSchema: T
  ): Promise<z.infer<ReturnType<typeof createPaginationResponseSchema<T>>>> {
    const searchCollection = params.search
      ? collection
          .where("name", ">=", params.search)
          .where("name", "<=", params.search + "\uf8ff")
      : collection;

    // Create base query for counting
    let countQuery = searchCollection.orderBy(
      params.sort.field,
      params.sort.order
    );
    params.filters?.forEach((filter) => {
      countQuery = countQuery.where(
        filter.field,
        filter.operator,
        filter.value
      );
    });

    // Get total count
    const totalItems = (await countQuery.count().get()).data().count;
    const totalPages = Math.ceil(totalItems / params.pagination.limitPerPage);

    // Create paginated query
    let queryRef = countQuery.limit(params.pagination.limitPerPage);

    // Proper cursor-based pagination
    if (params.pagination.page > 1) {
      // First get the last document of the previous page
      const prevPageQuery = countQuery.limit(
        (params.pagination.page - 1) * params.pagination.limitPerPage
      );
      const prevPageSnapshot = await prevPageQuery.get();
      const lastDoc = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];

      if (lastDoc) {
        queryRef = queryRef.startAfter(lastDoc);
      }
    }

    // Execute the query
    const snapshot = await queryRef.get();

    // Parse data
    const items = snapshot.docs.map((doc) => {
      return dataSchema.parse({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Calculate pagination metadata
    const nextPage =
      params.pagination.page < totalPages ? params.pagination.page + 1 : null;
    const previousPage =
      params.pagination.page > 1 ? params.pagination.page - 1 : null;

    const response = {
      data: items,
      meta: {
        pagination: {
          totalItems,
          page: params.pagination.page,
          limitPerPage: params.pagination.limitPerPage,
          nextPage,
          previousPage,
        },
        sort: params.sort,
        filters: params.filters,
        search: params.search,
      },
    };

    return response;
  }
}
