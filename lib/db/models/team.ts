import mongoose, { Document, Schema } from "mongoose";


const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true, unique: true, trim: true, uppercase: true },
    imageUrl: { type: String, trim: true },
    pageUrl: { type: String, trim: true },
    contactInfo: { type: String, trim: true },
    players: [{
        userId: { type: String, ref: "User", required: true },
        role: { type: [String], enum: ["member", "leader", "founder"], default: "member" },
        status: { type: String, enum: ["active", "time-off", "removed"], default: "active" },
    }],

}, { timestamps: true });


export interface Team extends Document<string> { }


export const Team = mongoose.models.Teams || mongoose.model("Teams", TeamSchema);