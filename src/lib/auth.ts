import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        // Anonymous credential provider for guest mode
        Credentials({
            id: "anonymous",
            name: "Anonymous",
            credentials: {
                sessionId: { label: "Session ID", type: "text" },
            },
            async authorize(credentials) {
                const sessionId = credentials?.sessionId as string;
                if (!sessionId) return null;

                // Find or create anonymous user
                let user = await prisma.user.findUnique({
                    where: { sessionId },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            sessionId,
                            name: "Pengguna Anonim",
                        },
                    });
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
