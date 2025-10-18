import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import axios from "axios";
import { storage } from "./storage";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const CLICKUP_CLIENT_ID = process.env.CLICKUP_CLIENT_ID!;
const CLICKUP_CLIENT_SECRET = process.env.CLICKUP_CLIENT_SECRET!;

// Determine the redirect URI based on environment
let REDIRECT_URI: string;
if (process.env.REDIRECT_URI) {
  // Use explicit REDIRECT_URI if set
  REDIRECT_URI = process.env.REDIRECT_URI;
} else if (process.env.REPLIT_DEV_DOMAIN) {
  // Replit environment
  REDIRECT_URI = `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/callback`;
} else if (process.env.RENDER_EXTERNAL_URL) {
  // Render environment
  REDIRECT_URI = `${process.env.RENDER_EXTERNAL_URL}/api/auth/callback`;
} else {
  // Local development
  REDIRECT_URI = "http://localhost:5000/api/auth/callback";
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "clickup-oauth-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.get("/api/auth/clickup", (req: Request, res: Response) => {
    const authUrl = `https://app.clickup.com/api?client_id=${CLICKUP_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(authUrl);
  });

  app.get("/api/auth/callback", async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
      const tokenResponse = await axios.post(
        "https://api.clickup.com/api/v2/oauth/token",
        {
          client_id: CLICKUP_CLIENT_ID,
          client_secret: CLICKUP_CLIENT_SECRET,
          code,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get(
        "https://api.clickup.com/api/v2/user",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const clickupUser = userResponse.data.user;

      // Fetch user's teams/workspaces
      const teamsResponse = await axios.get(
        "https://api.clickup.com/api/v2/team",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const teams = teamsResponse.data.teams || [];
      const authorizedWorkspaces = teams.map((team: any) => ({
        team_id: team.id,
        team_name: team.name,
        authorized_at: new Date().toISOString(),
      }));

      // Use first team as primary team
      const primaryTeam = teams[0];

      let user = await storage.getUserByClickupUserId(clickupUser.id.toString());

      if (user) {
        user = await storage.updateUser(user.id, {
          clickupUserId: clickupUser.id.toString(),
          username: clickupUser.username,
          email: clickupUser.email,
          profilePicture: clickupUser.profilePicture,
          accessToken,
          tokenType: "Bearer",
          teamId: primaryTeam?.id,
          teamName: primaryTeam?.name,
          authorizedWorkspaces,
          userData: clickupUser,
        });
      } else {
        user = await storage.createUser({
          clickupUserId: clickupUser.id.toString(),
          username: clickupUser.username,
          email: clickupUser.email,
          profilePicture: clickupUser.profilePicture,
          accessToken,
          tokenType: "Bearer",
          teamId: primaryTeam?.id,
          teamName: primaryTeam?.name,
          authorizedWorkspaces,
          userData: clickupUser,
        });
      }

      if (!user) {
        return res.status(500).json({ error: "Failed to create or update user" });
      }

      req.session.userId = user.id;

      res.json({ success: true, user });
    } catch (error: any) {
      console.error("OAuth callback error:", error.response?.data || error.message);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get("/api/user/profile", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(404).json({ error: "User not found" });
      }

      const { accessToken, ...userWithoutToken } = user;
      res.json(userWithoutToken);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
