import { Schema, model, models, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const GAME_MODES = [
  "domination",
  "kill-confirmed",
  "shield",
  "sensor-movement",
  "disarm",
  "extract",
  "avalanche",
] as const;
export type GameMode = typeof GAME_MODES[number];

export type GameStatus = "planned" | "in_progress" | "completed" | "cancelled";
export type GameType = "race" | "training" | "time_trial" | "other";

const ParticipantGroupSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    groupName: { type: String, trim: true },
    groupColor: { type: String, trim: true },
  },
  { _id: false, timestamps: true }
);


const ParticipantSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    playerId: { type: String, ref: "Player", index: true, required: true },
    rfid: { type: String, trim: true, default: "" },
    groupId: { type: String, default: null  },
    group: { type: ParticipantGroupSchema }, 
    isPresent: { type: Boolean, default: false },
  },
  { _id: false, timestamps: true }
);

const GameDeviceSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    deviceId: { type: String, ref: "Device", index: true, required: true },
    assignedPlayerId: { type: String, ref: "Player", required: false, default: null },
    deviceStatus: {
      type: String,
      enum: ["online", "offline", "in_use"],
      default: "offline",
    },
    havePlayerReturnDevice: { type: Boolean, default: false },
    deviceLocation: { type: String, trim: true, default: null },
  },
  { _id: false, timestamps: true }
);

const GameResultSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    playerId: { type: String, ref: "Player", index: true, required: true },
    gameDeviceId: { type: String, required: true },
    playerAction: { type: String, enum: ["kill", "dead", "check"], required: true },
    time: { type: Number, min: 0, required: true }, 
  },
  { _id: false, timestamps: true }
);

const GameSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 }, // UUID como primary key
    name: { type: String, required: true, trim: true, index: true },
    date: { type: Date },
    status: { type: String, enum: ["planned", "in_progress", "completed", "cancelled"], default: "planned", index: true },
    startTime: { type: Date },
    endTime: { type: Date },
    type: { type: String },
    fieldMapId: { type: String, default: "" },
    registerPlayers: { type: [ParticipantSchema], default: [] },
    gameDevices: { type: [GameDeviceSchema], default: [] },
    gameResults: { type: [GameResultSchema], default: [] },
    gameSettings: { type: {
      groups: { type: [ParticipantGroupSchema], default: [
        { groupName: "Red", groupColor: "red" },
        { groupName: "No color", groupColor: "no-color" },
      ] },
    }},
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export type GameDoc = {
  id: string;
  name: string;
  date?: Date;
  status: GameStatus;
  startTime?: Date;
  endTime?: Date;
  type: GameType;
  registerPlayers: Array<{
    id: string;
    playerId: string;
    rfid?: string;
    groupId: string | null;
    createdAt: Date; updatedAt: Date;
  }>;
  gameDevices: Array<{
    id: string;
    deviceId: string;
    deviceStatus: string;
    assignedPlayerId?: string | null;
    deviceLocation?: string;
    havePlayerReturnDevice: boolean;
    createdAt: Date; 
    updatedAt: Date;
  }>;
  gameResults: Array<{
    id: string;
    playerId: string;
    gameDeviceId: string;
    time: number;
    createdAt: Date; updatedAt: Date;
  }>;
  gameSettings: {
    groups: Array<{
      id: string;
      groupName?: string;
      groupColor?: string;
      createdAt: Date; updatedAt: Date;
    }>;
  }
  createdAt: Date; updatedAt: Date;
};

export default models.Game || model<GameDoc>("Game", GameSchema);