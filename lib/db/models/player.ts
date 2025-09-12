import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PlayerSchema = new Schema(
  {
    _id: { type: String, default: uuidv4, index: true },               // UUID primário
    name: { type: String, required: true, trim: true },
    // APD (ex.: código/registro). 'sparse' permite vários null sem quebrar 'unique'
    apd: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    apdValidateDate: { type: Date },                      // use Date, não String
    team: { type: String, trim: true },                   // mude para { ref: "Team" } se tiver modelo
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


// Virtual: APD válido?
PlayerSchema.virtual("apdIsValid").get(function () {
  if (!this.apd || !this.apdValidateDate) return false;
  return this.apdValidateDate >= new Date();
});

export default models.Player || model("Player", PlayerSchema);