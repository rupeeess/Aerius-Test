import { type User, type InsertUser } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByClickupId(clickupId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByClickupId(clickupId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clickup_id", clickupId)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        clickup_id: insertUser.clickupId,
        username: insertUser.username,
        email: insertUser.email,
        profile_picture: insertUser.profilePicture,
        access_token: insertUser.accessToken,
        user_data: insertUser.userData,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: any = {};
    if (user.clickupId) updateData.clickup_id = user.clickupId;
    if (user.username) updateData.username = user.username;
    if (user.email) updateData.email = user.email;
    if (user.profilePicture) updateData.profile_picture = user.profilePicture;
    if (user.accessToken) updateData.access_token = user.accessToken;
    if (user.userData) updateData.user_data = user.userData;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as User;
  }
}

export const storage = new SupabaseStorage();
