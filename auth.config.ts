import { sql } from '@vercel/postgres';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
import bcrypt from "bcryptjs";
// const bcrypt = require("bcrypt");


async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const authConfig: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async signIn({ account }) {
            console.log('first here')
            if (account?.provider === 'credentials' && account?.providerAccountId) {
                return true;
            } else {
                return false
            }
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                console.log('Here')
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email);
                    console.log(user)
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }
                console.log('Invalid credentials');
                return null
            },
        }),
    ],
} 