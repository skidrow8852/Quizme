import { atom } from "recoil";

export const adminState = atom({
  key: "admin",
  default: {},
});

export const quizzesState = atom({
  key: "quizzes_admin",
  default: [],
});

export const statementsState = atom({
  key: "statements_admin",
  default: null,
});

export const clientsState = atom({
  key: "clients_admin",
  default: [],
});
