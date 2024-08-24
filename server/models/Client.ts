import mongoose, { Schema } from "mongoose";

const ClientSchema = new Schema(
  {
    fullName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true },
    generatedQuizes: [{ type: Schema.Types.ObjectId, ref: "Statement" }],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
