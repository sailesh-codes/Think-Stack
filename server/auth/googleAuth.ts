import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authStorage } from "../replit_integrations/auth/storage";

interface GoogleProfile {
  id: string;
  emails: Array<{ value: string }>;
  name: { givenName: string; familyName: string };
  photos: Array<{ value: string }>;
}

// Configure Passport with Google OAuth
export function setupGoogleAuth() {
  const verify = async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void
  ) => {
    try {
      // Extract user info from Google profile
      const userData = {
        id: profile.id,
        email: profile.emails[0]?.value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImageUrl: profile.photos[0]?.value,
      };

      // Upsert user in database
      await authStorage.upsertUser(userData);

      // Return user data
      done(null, userData);
    } catch (error) {
      done(error, null);
    }
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback",
      },
      verify
    )
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authStorage.getUser(id);
      // If user not found in DB, return a minimal user object so req.user is never undefined
      if (!user) {
        return done(null, { id });
      }
      done(null, user);
    } catch (error) {
      // Even on DB error, return a minimal user to prevent undefined req.user
      done(null, { id });
    }
  });
}
