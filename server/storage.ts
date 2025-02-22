import { User, Content, InsertUser, InsertContent } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getContent(id: number): Promise<Content | undefined>;
  getContentsByUser(userId: number): Promise<Content[]>;
  createContent(content: InsertContent & { authorId: number }): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content>;
  deleteContent(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private currentUserId: number;
  private currentContentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getContentsByUser(userId: number): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      (content) => content.authorId === userId,
    );
  }

  async createContent(content: InsertContent & { authorId: number }): Promise<Content> {
    const id = this.currentContentId++;
    const newContent: Content = {
      ...content,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      factCheckScore: null,
    };
    this.contents.set(id, newContent);
    return newContent;
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<Content> {
    const existing = await this.getContent(id);
    if (!existing) throw new Error("Content not found");
    
    const updated: Content = {
      ...existing,
      ...content,
      updatedAt: new Date(),
    };
    this.contents.set(id, updated);
    return updated;
  }

  async deleteContent(id: number): Promise<void> {
    this.contents.delete(id);
  }
}

export const storage = new MemStorage();
