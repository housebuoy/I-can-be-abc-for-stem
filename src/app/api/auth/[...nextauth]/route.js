import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../../../lib/database";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    EmailProvider({
      id: 'email',
      name: 'email',
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Using JSON Web Token for sessions
  },
  adapter: PrismaAdapter(prisma), 
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // For Google Sign-in, you can map the user's full name to the `name` field
        user.name = profile.name;  // Here profile.name contains the full name
      }

      if (account.provider === "facebook") {
        // For Facebook Sign-in, the profile may contain a name field as well
        user.name = profile.name;  // Same here for Facebook profile
      }

      user.name = fullName;

      // You can also customize it further if you want to store more info from the profile

      // Optionally, you could update the user in the database if needed
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: { 
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });

      console.log("User signed in:", user);
      return true; // Continue the sign-in process
    },
    async signOut({ token, session }) {
      console.log("User signed out:", session);
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// export { authHandlers };
