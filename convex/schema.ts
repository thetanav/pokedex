import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  favorites: defineTable({
    userId: v.id("users"),
    pokemonName: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_pokemon", ["userId", "pokemonName"]),
});

export default schema;
