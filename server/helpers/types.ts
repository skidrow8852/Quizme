import { Schema } from "mongoose";


export type Token = {
  id: string;
  email: string;
  exp: number;
};


type Score = {
  score? : number,
  quizId? : Schema.Types.ObjectId,
  result? : string,

}
export type Attendants = {
  username: string;
  password : string,
  date: Date;
  isFinished?: boolean;
  lastScore?: Score[];
};


export type Answer = {
  key: number;
  value: string;
  points : number
};

export type Question = {
  id: number;
  title: string;
  answers: Answer[];
};