import { pgTable, text, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

// --- Better Auth Tables ---

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

// --- Application Tables ---

export const project = pgTable("project", {
    id: text("id").primaryKey(), // Using text/cuid/uuid as string for consistency with Better Auth
    name: text("name").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    description: text("description"),
    isPublic: boolean("isPublic").default(false).notNull(),
});

export const file = pgTable("file", {
    id: text("id").primaryKey(),
    projectId: text("projectId").notNull().references(() => project.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    content: text("content").default("").notNull(),
    type: text("type").notNull(), // 'file' | 'folder'
    parentId: text("parentId"),   // Self-reference handled in application logic or separate FK if needed
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
