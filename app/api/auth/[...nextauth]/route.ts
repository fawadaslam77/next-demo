import { createUser, getUserByEmail } from '@/app/lib/data';
import { compare } from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const handler = NextAuth({
    pages: {
        signIn: '/login',
    },
    secret: 'EEL1heHxhhD1BYwiA0oL6F5f7pxXH5FnHeoKSK5HB8Q=',
    providers: [
        // GoogleProvider({
        //     clientId: process?.env?.GOOGLE_ID as string,
        //     clientSecret: process?.env?.GOOGLE_CLIENT_SECRET?.toString() as string,
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                console.log('eadasd')
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                console.log(parsedCredentials)
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUserByEmail(email);
                    console.log(user)
                    if (!user) return null;
                    const passwordsMatch = await compare(password, user.password);
                    if (passwordsMatch) return user;
                    return null
                }

            },
        })
    ],
    callbacks: {
        async session({ session }) {
            console.log('Session Callback')
            // const sessionUser = await getUserByEmail(session?.user?.email);
            // if (sessionUser.id && session.user) {
            //     delete sessionUser['password'];
            //     session.user = sessionUser
            // }
            return session;
        },

        async jwt({ token, account, profile }) {
            console.log('Jwt Callback')
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                // token.id = profile.id
            }
            return token
        },

        async signIn({ user, account, profile }) {
            // if (account?.provider === 'google') {
            //     console.log('User verified from google')
            //     const user_exists = await getUserByEmail(profile?.email);
            //     if (!user_exists) {
            //         console.log('User not exists')
            //         try {
            //             const create = await createUser(profile);
            //             console.log('User Created')
            //         } catch (error) {
            //             console.log(error)
            //         }
            //     } else {
            //         console.log('User exists.')
            //     }

            //     return true
            // }
            // else 
            if (account?.provider === 'credentials' && account?.providerAccountId) {
                console.log('herer')
                return true
            } else {
                return false
            }
        },
    }

})

export { handler as GET, handler as POST }