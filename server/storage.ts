import { type User, type InsertUser, type ContentGeneration, type InsertContentGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContentGeneration(content: InsertContentGeneration): Promise<ContentGeneration>;
  getUserContentGenerations(userId: string): Promise<ContentGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contentGenerations: Map<string, ContentGeneration>;

  constructor() {
    this.users = new Map();
    this.contentGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContentGeneration(insertContent: InsertContentGeneration): Promise<ContentGeneration> {
    const id = randomUUID();
    const content: ContentGeneration = {
      ...insertContent,
      id,
      userId: null,
      createdAt: new Date(),
    };
    this.contentGenerations.set(id, content);
    return content;
  }

  async getUserContentGenerations(userId: string): Promise<ContentGeneration[]> {
    return Array.from(this.contentGenerations.values()).filter(
      (content) => content.userId === userId,
    );
  }
}

export const storage = new MemStorage();
