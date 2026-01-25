import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const toggleFavorite = mutation({
  args: { pokemonName: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_pokemon", (q) => q.eq("userId", userId).eq("pokemonName", args.pokemonName))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // removed
    } else {
      await ctx.db.insert("favorites", {
        userId,
        pokemonName: args.pokemonName,
        createdAt: Date.now(),
      });
      return true; // added
    }
  },
});

export const getUserFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const isFavorite = query({
  args: { pokemonName: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_pokemon", (q) => q.eq("userId", userId).eq("pokemonName", args.pokemonName))
      .first();

    return !!favorite;
  },
});