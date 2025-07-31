import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contentGenerations = pgTable("content_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  platform: text("platform").notNull(), // 'instagram' | 'linkedin'
  contentType: text("content_type"), // 'post' | 'reel' | 'story' for Instagram
  topic: text("topic").notNull(),
  generatedContent: jsonb("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContentGenerationSchema = createInsertSchema(contentGenerations).pick({
  platform: true,
  contentType: true,
  topic: true,
  generatedContent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContentGeneration = z.infer<typeof insertContentGenerationSchema>;
export type ContentGeneration = typeof contentGenerations.$inferSelect;
