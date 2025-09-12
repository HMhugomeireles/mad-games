import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const FieldMapSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 }, // UUID como PK
    fieldMap: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ["cqb", "misto", "mato", "other"] },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    createdBy: { type: String, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id; // expõe id como alias
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.models.FieldMap || mongoose.model("FieldMap", FieldMapSchema);