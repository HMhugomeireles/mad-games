import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PlayerSchema = new Schema(
  {
    _id: { type: String, default: uuidv4, index: true },
    name: { type: String, required: true, trim: true },
    apd: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    apdValidateDate: { type: Date },                      // use Date, não String
    team: { type: String, trim: true },                   // mude para { ref: "Team" } se tiver modelo
  },
  {
    timestamps: true,
  }
);


// Virtual: APD válido?
PlayerSchema.virtual("apdIsValid").get(function () {
  if (!this.apd || !this.apdValidateDate) return false;
  return this.apdValidateDate >= new Date();
});

export default models.Player || model("Player", PlayerSchema);