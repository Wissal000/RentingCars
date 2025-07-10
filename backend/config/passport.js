import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";

export function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              username: profile.displayName, // ✅ save as 'username' instead of 'name'
              email: profile.emails[0].value,
              googleId: profile.id,
              provider: "google", // optional but recommended
            });
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}
