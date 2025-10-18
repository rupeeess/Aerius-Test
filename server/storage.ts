import { type User, type InsertUser } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByClickupUserId(clickupUserId: string): Promise<User | undefined>;
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

  async getUserByClickupUserId(clickupUserId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clickup_user_id", clickupUserId)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        clickup_user_id: insertUser.clickupUserId,
        username: insertUser.username,
        email: insertUser.email,
        profile_picture: insertUser.profilePicture,
        access_token: insertUser.accessToken,
        token_type: insertUser.tokenType || "Bearer",
        expires_at: insertUser.expiresAt,
        scopes_granted: insertUser.scopesGranted,
        team_id: insertUser.teamId,
        team_name: insertUser.teamName,
        authorized_workspaces: insertUser.authorizedWorkspaces || [],
        user_data: insertUser.userData,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: any = {};
    if (user.clickupUserId) updateData.clickup_user_id = user.clickupUserId;
    if (user.username) updateData.username = user.username;
    if (user.email) updateData.email = user.email;
    if (user.profilePicture) updateData.profile_picture = user.profilePicture;
    if (user.accessToken) updateData.access_token = user.accessToken;
    if (user.tokenType) updateData.token_type = user.tokenType;
    if (user.expiresAt) updateData.expires_at = user.expiresAt;
    if (user.scopesGranted) updateData.scopes_granted = user.scopesGranted;
    if (user.teamId) updateData.team_id = user.teamId;
    if (user.teamName) updateData.team_name = user.teamName;
    if (user.authorizedWorkspaces) updateData.authorized_workspaces = user.authorizedWorkspaces;
    if (user.userData) updateData.user_data = user.userData;

    updateData.updated_at = new Date().toISOString();
    updateData.last_sync = new Date().toISOString();

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
