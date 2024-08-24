import mongoose, { Schema, Document } from "mongoose";
import { Question } from "../helpers/types";

type Result = {
  range: string;
  message: string;
};

interface QuizzesDocument extends Document {
  title: string;
  thumbnail: string;
  intro? : string;
  questions: Question[];
  description: string;
  results?: Result[];
}

const QuizzesSchema = new Schema<QuizzesDocument>(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: false , default : "https://marketplace.canva.com/EAFCO6pfthY/1/0/1600w/canva-blue-green-watercolor-linktree-background-F2CyNS5sQdM.jpg"},
    description: { type: String, required: true },
    intro:  { type: String, required: false },
    results: [Object],
    questions: [Object],
  },
  { timestamps: true }
);

const Quizzes = mongoose.model<QuizzesDocument>("Quizzes", QuizzesSchema);

module.exports = Quizzes;
