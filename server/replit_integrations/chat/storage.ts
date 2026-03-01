import { getDatabase } from "../../db";
import { type Conversation, type Message } from "@shared/models/chat";
import { ObjectId } from "mongodb";

export interface IChatStorage {
  getConversation(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(conversationId: string, role: string, content: string): Promise<Message>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: string) {
    const db = await getDatabase();
    const collection = db.collection('conversations');
    
    const conversationDoc = await collection.findOne({ id });
    return conversationDoc ? (conversationDoc as unknown as Conversation) : undefined;
  },

  async getAllConversations() {
    const db = await getDatabase();
    const collection = db.collection('conversations');
    
    const conversations = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return conversations as unknown as Conversation[];
  },

  async createConversation(title: string) {
    const db = await getDatabase();
    const collection = db.collection('conversations');
    
    const conversation: Conversation = {
      id: new ObjectId().toString(),
      title,
      createdAt: new Date()
    };
    
    await collection.insertOne(conversation as any);
    return conversation;
  },

  async deleteConversation(id: string) {
    const db = await getDatabase();
    const messagesCollection = db.collection('messages');
    const conversationsCollection = db.collection('conversations');
    
    await messagesCollection.deleteMany({ conversationId: id });
    await conversationsCollection.deleteOne({ id });
  },

  async getMessagesByConversation(conversationId: string) {
    const db = await getDatabase();
    const collection = db.collection('messages');
    
    const messages = await collection
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .toArray();
    
    return messages as unknown as Message[];
  },

  async createMessage(conversationId: string, role: string, content: string) {
    const db = await getDatabase();
    const collection = db.collection('messages');
    
    const message: Message = {
      id: new ObjectId().toString(),
      conversationId,
      role: role as 'user' | 'assistant' | 'system',
      content,
      createdAt: new Date()
    };
    
    await collection.insertOne(message as any);
    return message;
  },
};

