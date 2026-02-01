import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PlayerSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, trim: true },
    apd: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    apdValidateDate: { type: Date },
    team: { type: String, trim: true },
    contactInfo: { type: String },
    email: { type: String, trim: true, lowercase: true },
    avatarUrl: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export type PlayerDoc = {
  _id: string;
  name: string;
  apd?: string;
  apdValidateDate?: Date;
  team?: string;
  contactInfo?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date; 
  updatedAt: Date;
}

// Virtual: APD válido?
PlayerSchema.virtual("apdIsValid").get(function () {
  if (!this.apd || !this.apdValidateDate) return false;
  return this.apdValidateDate >= new Date();
});

export default models.Player || model("Player", PlayerSchema);