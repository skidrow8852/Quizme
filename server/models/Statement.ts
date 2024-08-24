import mongoose, { Schema, Document } from "mongoose";
import { Attendants } from "../helpers/types";

interface StatementDocument extends Document {
  client: Schema.Types.ObjectId;
  isApproved: boolean;
  quizId: Schema.Types.ObjectId[];
  numOfUsers: number;
  attendants?: Attendants[];
  companyName : string;
  price : number;
}

const StatementSchema = new Schema<StatementDocument>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    quizId: [{
      type: Schema.Types.ObjectId,
      ref: "Quizzes",
      required: true,
    }],
    numOfUsers: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    attendants: [Object],
    companyName: {type : String, required : true}
  },
  { timestamps: true }
);

const Statement = mongoose.model<StatementDocument>("Statement", StatementSchema);

module.exports = Statement;
