import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { en } from "zod/v4/locales";
import { DEVICE_GROUP, STATUS_OPTIONS, VARIANTS_OPTIONS } from "./device";

export const GAME_MODES = [
  "domination",
  "kill-confirmed",
  "shield",
  "sensor-movement",
  "disarm",
  "extract",
  "avalanche",
] as const;
export const GameStatus = ["planned", "in_progress", "completed", "cancelled"] as const;
export const NodeScopes = ["individual", "team", "game"] as const;
export const ASSIGNMENT_TYPES = ["individual", "team", "game"] as const;
export const PLAYER_TYPES = ["normal", "medic", "eod"] as const;

export type GameMode = typeof GAME_MODES[number];
export type GameStatusType = typeof GameStatus[number];
export type NodeScopesType = typeof NodeScopes[number];
export type PlayerTypes = typeof PLAYER_TYPES[number];

const ParticipantGroupSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    groupName: { type: String, trim: true },
    groupColor: { type: String, trim: true },
    group: { type: String, enum: DEVICE_GROUP },
  },
  { _id: false, timestamps: true }
);

const RegisterGamePlayerSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    playerId: { type: String, ref: "Player", index: true, required: true },
    playerName: { type: String, trim: true, default: "" },
    isPresent: { type: Boolean, default: false },
  },
  { _id: false, timestamps: true }
);

const RegisterGameDeviceSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    deviceId: { type: String, ref: "Device", index: true, required: true },
    deviceName: { type: String, trim: true, default: "" },
    macAddress: { type: String, trim: true, default: "" },
    group: { type: String, enum: DEVICE_GROUP, default: null },
    variant: { type: String, enum: VARIANTS_OPTIONS },
  },
  { _id: false, timestamps: true }
);

const GroupNodesSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    groupId: { type: String, required: true },
    groupName: { type: String, trim: true },
    groupColor: { type: String, trim: true },
    group: { type: String, enum: DEVICE_GROUP },
    respawnDevice: {
      type: {
        id: String,
        name: String,
        status: { type: String, enum: STATUS_OPTIONS, default: "offline" },
        macAddress: String,
      }
    },
    baseDevice: {
      type: {
        id: String,
        name: String,
        status: { type: String, enum: STATUS_OPTIONS, default: "offline" },
        macAddress: String,
      }
    },
    nodes: {
      type: [{
        playerId: String,
        playerName: String,
        playerType: { type: String, enum: PLAYER_TYPES, default: "normal" },
        devices: {
          type: [{
            deviceId: String,
            deviceName: String,
            deviceStatus: { type: String, enum: STATUS_OPTIONS, default: "offline" },
            macAddress: String,
            isReturned: { type: Boolean, default: false }
          }], default: []
        },
      }], default: []
    },
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
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, trim: true, index: true },
    date: { type: Date },
    status: { type: String, enum: GameStatus, default: "planned", index: true },
    startTime: { type: Date },
    endTime: { type: Date },
    type: { type: String },
    fieldMapId: { type: String, default: "" },
    assignedPlayers: { type: [RegisterGamePlayerSchema], default: [] },
    assignedDevices: { type: [RegisterGameDeviceSchema], default: [] },
    groupsNodes: { type: [GroupNodesSchema], default: [] },
    gameResults: { type: [GameResultSchema], default: [] },
    gameSettings: {
      type: {
        groups: {
          type: [ParticipantGroupSchema],
          default: [],
        },
        maxplayers: { type: Number },
        deadWaitTimeSeconds: { type: Number },
        respawnTimeSeconds: { type: Number },
        respawnType: { type: String, enum: ["players-number", "time", "other"], default: "other" },
        respawnMaxPlayers: { type: Number },
      }
    },
  },
  {
    timestamps: true,
  }
)

export interface GameDoc extends Document {
  _id: string;
  name: string;
  date?: Date;
  status: string;
  startTime?: Date;
  endTime?: Date;
  fieldMapId?: string;
  type: string;
  assignedPlayers: Array<{
    playerId: string
    playerName: string;
    isPresent: boolean;
  }>;
  assignedDevices: Array<{
    deviceId: string;
    deviceName?: string;
    deviceStatus: string;
    macAddress: string;
    group?: string | null;
    variant?: string;
  }>;
  groupsNodes: Array<{
    id: string;
    groupId: string;
    groupName?: string;
    group: string;
    respawnDevice: {
      id: string;
      name: string;
      status: string;
      macAddress: string;
    }
    baseDevice: {
      id: string;
      name: string;
      status: string;
      macAddress: string;
    };
    nodes: Array<{
      playerId: string;
      playerName?: string;
      playerType: string;
      playerPresence: boolean;
      devices: Array<{
        deviceId: string;
        deviceName?: string;
        deviceStatus: string;
        macAddress: string;
        isReturned: boolean
      }>;
      //scope: string;
    }>;
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
      group: string;
      defaultDeviceId?: string;
      createdAt: Date; updatedAt: Date;
    }>;
    maxplayers?: number;
    deadWaitTimeSeconds?: number;
    respawnTimeSeconds?: number;
    respawnType?: string;
    respawnMaxPlayers?: number;
  }
  createdAt: Date; updatedAt: Date;
};

export default models.Game || model<GameDoc>("Game", GameSchema);