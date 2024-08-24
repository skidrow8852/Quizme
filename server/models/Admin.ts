import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface AdminDocument extends Document {
  email: string;
  password: string;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<AdminDocument>("Admin", AdminSchema);
module.exports = Admin;
