import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { User, Session, Account, Verification } from "../db/models/auth";
import { dbConnect } from "../db/mongo";
import { admin } from "better-auth/plugins"


const mongooseInstance = await dbConnect();

const client = mongooseInstance.connection.getClient();

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), { usePlural: true }),
    baseURL: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    models: {
        User,
        Session,
        Account,
        Verification
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
        },
    },
    plugins: [
        admin()
    ]
});