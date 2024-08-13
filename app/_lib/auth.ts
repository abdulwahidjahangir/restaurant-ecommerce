import NextAuth, { Session, User, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
    role?: string;
  }

  interface Session {
    user: User & {
      firstName?: string;
      lastName?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string;
    lastName?: string;
    role?: string;
  }
}

const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        console.log(credentials);
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signin`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (res.status === 401 || !res?.data) {
            return null;
          }

          return {
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            role: res.data.isAdmin ? "admin" : "user"
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  salt: process.env.NEXTAUTH_SALT,
  pages: {
    signIn: '/auth/signin',
  }
};

export const { auth, signOut, handlers: { GET, POST } } = NextAuth(authConfig);