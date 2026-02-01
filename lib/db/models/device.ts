import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";


export const VARIANTS_OPTIONS = ["electronic", "bracelet"] as const;
export const STATUS_OPTIONS = ["online", "offline"] as const;
export const DEVICE_GROUP_TYPE = ["individual", "team", "game", "settings", "respawn"] as const;
export const DEVICE_GROUP = ["A00", "B00", "C00", "D00", "E00"] as const;

export type VARIANTS_OPTIONS_TYPE = typeof VARIANTS_OPTIONS[number];
export type STATUS_OPTIONS_TYPE = typeof STATUS_OPTIONS[number];
export type DEVICE_GROUP_TYPES = typeof DEVICE_GROUP_TYPE[number];
export type DEVICE_GROUPS_T = typeof DEVICE_GROUP[number];

const DeviceSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 }, // UUID como PK
    name: { type: String, required: true, trim: true },
    mac: {
      type: String,
      trim: true,
      set: (v: string) => (v ? v.toLowerCase().replace(/[^a-f0-9]/g, "") : v),
      validate: { validator: (v: string) => !v || /^[a-f0-9]{12}$/.test(v), message: "MAC inválido" },
      default: null,
    },
    description: { type: String, trim: true },
    variant: { type: String, enum: VARIANTS_OPTIONS, default: "electronic" },
    status: { type: String, enum: STATUS_OPTIONS, default: "offline" },
    groupType: { type: String, enum: DEVICE_GROUP_TYPE, default: "individual" },
    group: { type: String, enum: DEVICE_GROUP, default: null },
  },
  {
    timestamps: true,
  }
);

DeviceSchema.index(
  { mac: 1 },
  { unique: true, partialFilterExpression: { mac: { $exists: true, $ne: null } } }
);

export type DeviceDoc = {
  _id: string;
  name: string;
  mac?: string;
  description?: string;
  variant: VARIANTS_OPTIONS_TYPE;
  status: STATUS_OPTIONS_TYPE;
  groupType: DEVICE_GROUP_TYPES;
  group?: DEVICE_GROUPS_T | null;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.models.Device || mongoose.model("Device", DeviceSchema);