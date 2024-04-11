import {NextApiHandler} from 'next';
import NextAuth from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({session, token, user}) {
            // Send properties to the client, like an access_token from a provider.
            // session.accessToken = token.accessToken
            return session
        }
    }
};