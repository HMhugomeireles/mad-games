import mongoose from "mongoose";

// --- 1. Schemas Obrigatórios do Better-Auth ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    contact: { type: String },
    apd: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    apdValidateDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // O teus campos personalizados para o Mad Games
    role: { type: String, default: "user" },
}, { timestamps: true });

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
}, { timestamps: true });

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: String, required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    password: { type: String },
}, { timestamps: true });

const VerificationSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

// --- 2. Exportar Modelos (Singleton para evitar erros de re-compilação) ---
export const User = mongoose.models.Users || mongoose.model("Users", UserSchema);
export const Session = mongoose.models.Sessions || mongoose.model("Sessions", SessionSchema);
export const Account = mongoose.models.Accounts || mongoose.model("Accounts", AccountSchema);
export const Verification = mongoose.models.Verifications || mongoose.model("Verifications", VerificationSchema);


