import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Defina MONGODB_URI no .env.local");

type TGlobal = typeof globalThis & {
  _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const g = global as TGlobal;

if (!g._mongoose) g._mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (g._mongoose!.conn) return g._mongoose!.conn;

  if (!g._mongoose!.promise) {
    mongoose.set("strictQuery", true);
    g._mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // serverSelectionTimeoutMS: 5000, // opcional
    });
  }

  g._mongoose!.conn = await g._mongoose!.promise;
  return g._mongoose!.conn;
}