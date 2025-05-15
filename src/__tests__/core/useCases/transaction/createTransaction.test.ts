import { TransactionEntity } from "@/core/entities/TransactionEntity";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { CreateTransactionInput } from "@/core/schemas/transactionSchema";
import { CreateTransactionUseCase } from "@/core/useCases/transaction/createTransaction";

// Mock the repository
const mockTransactionRepository: jest.Mocked<ITransactionRepository> = {
  createTransaction: jest.fn(),
  getTransaction: jest.fn(),
  getMultipleTransactions: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
};

describe("CreateTransactionUseCase", () => {
  let createTransactionUseCase: CreateTransactionUseCase;

  beforeEach(() => {
    createTransactionUseCase = new CreateTransactionUseCase(
      mockTransactionRepository
    );
  });

  it("should create a transaction", async () => {
    const input: CreateTransactionInput = {
      name: "Groceries",
      type: "expense",
      amount: 100,
      recipientOrPayer: "John Doe",
      category: {
        name: "Food",
        id: "1",
        color: "#000000",
      },
      transactionDate: new Date(),
      description: "Groceries",
      emoji: "🍎",
      userId: "1",
    };

    const expectedTransaction: TransactionEntity = {
      id: "1",
      type: "expense",
      name: "Groceries",
      amount: 100,
      recipientOrPayer: "John Doe",
      category: {
        name: "Food",
        id: "1",
        color: "#000000",
      },
      transactionDate: new Date(),
      description: "Groceries",
      emoji: "🍎",
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTransactionRepository.createTransaction.mockResolvedValue(
      expectedTransaction
    );

    const transaction = await createTransactionUseCase.execute(input);

    expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(
      input
    );
    expect(transaction).toEqual(expectedTransaction);
  });

  it("should throw an error if the transaction is not created", async () => {
    const input: CreateTransactionInput = {
      name: "Groceries",
      type: "expense",
      amount: 100,
      recipientOrPayer: "John Doe",
      category: {
        name: "Food",
        id: "1",
        color: "#000000",
      },
      transactionDate: new Date(),
      description: "Groceries",
      emoji: "🍎",
      userId: "1",
    };

    mockTransactionRepository.createTransaction.mockRejectedValue(
      new Error("Transaction not created")
    );

    await expect(createTransactionUseCase.execute(input)).rejects.toThrow(
      "Transaction not created"
    );
  });
});
