import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const DeviceSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 }, // UUID como PK
    name: { type: String, required: true, trim: true },
    mac: {
      type: String,
      trim: true,
      set: (v: string) => (v ? v.toLowerCase().replace(/[^a-f0-9]/g, "") : v),
      validate: { validator: (v: string) => !v || /^[a-f0-9]{12}$/.test(v), message: "MAC inválido" },
    },
    description: { type: String, trim: true },
    type: { type: String, enum: ["eletronic", "bracelet"], default: "eletronic" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
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

export default mongoose.models.Device || mongoose.model("Device", DeviceSchema);