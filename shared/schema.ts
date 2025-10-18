import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Workspace type for authorized_workspaces array
export const workspaceSchema = z.object({
  team_id: z.string(),
  team_name: z.string(),
  authorized_at: z.string(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // User Info
  clickupUserId: text("clickup_user_id").notNull().unique(),
  username: text("username").notNull(),
  email: text("email"),
  profilePicture: text("profile_picture"),

  // Authentication
  accessToken: text("access_token").notNull(),
  tokenType: text("token_type").default("Bearer"),
  expiresAt: timestamp("expires_at"),
  scopesGranted: text("scopes_granted").array(),

  // Primary Team/Workspace Info
  teamId: text("team_id"),
  teamName: text("team_name"),

  // All Authorized Workspaces
  authorizedWorkspaces: jsonb("authorized_workspaces").$type<Workspace[]>().default(sql`'[]'::jsonb`),

  // Full ClickUp user data (for reference)
  userData: jsonb("user_data"),

  // Metadata
  authorizationDate: timestamp("authorization_date").defaultNow().notNull(),
  lastSync: timestamp("last_sync").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorizationDate: true,
  lastSync: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
