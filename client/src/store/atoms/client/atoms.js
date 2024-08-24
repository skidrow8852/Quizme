import { atom } from "recoil";

export const clientState = atom({
  key: "client",
  default: {},
});

export const clientStatementsState = atom({
  key: "client_statements",
  default: [],
});

export const allQuizzesState = atom({
  key: "all_quizzes",
  default: [],
});
