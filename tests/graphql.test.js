import { describe, it, expect, vi } from "vitest";
import { productResolver } from "../graphql/resolver/product.resolver.js";
import { placeResolver } from "../graphql/resolver/place.resolver.js";
import { institutionResolver } from "../graphql/resolver/institution.resolver.js";

describe("GraphQL Resolvers", () => {
  const mockDb = {
    products: {
      collection: vi.fn().mockReturnThis(),
      find: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      findOne: vi.fn(),
      insertOne: vi.fn(),
    },
    main: {
      collection: vi.fn().mockReturnThis(),
      find: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      findOne: vi.fn(),
    },
    institutions: {
      collection: vi.fn().mockReturnThis(),
      find: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      findOne: vi.fn(),
    },
  };

  describe("Product Resolver", () => {
    it("should return a list of products", async () => {
      mockDb.products.toArray.mockResolvedValue([{ name: "Mock Product" }]);
      const result = await productResolver.Query.products(null, null, {
        db: mockDb,
      });
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("name", "Mock Product");
    });

    it("should return a single product by id", async () => {
      mockDb.products.findOne.mockResolvedValue({
        id: "123",
        name: "Mock Product",
      });
      const result = await productResolver.Query.product(
        null,
        { id: "123" },
        { db: mockDb },
      );
      expect(result).toHaveProperty("id", "123");
      expect(result).toHaveProperty("name", "Mock Product");
    });

    it("should create a product", async () => {
      mockDb.products.insertOne.mockResolvedValue({ acknowledged: true });
      const input = { name: "New Product", price: 50 };
      const result = await productResolver.Mutation.createProduct(
        null,
        { input },
        { db: mockDb },
      );
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name", "New Product");
    });
  });

  describe("Place Resolver", () => {
    it("should return a list of places", async () => {
      mockDb.main.toArray.mockResolvedValue([{ name: "Mock Place" }]);
      const result = await placeResolver.Query.places(null, null, {
        db: mockDb,
      });
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("name", "Mock Place");
    });
  });

  describe("Institution Resolver", () => {
    it("should return a list of institutions", async () => {
      mockDb.institutions.toArray.mockResolvedValue([
        { name: "Mock Institution" },
      ]);
      const result = await institutionResolver.Query.institutions(null, null, {
        db: mockDb,
      });
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("name", "Mock Institution");
    });
  });
});
