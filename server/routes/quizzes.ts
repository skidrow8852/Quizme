import { Router } from "express";

const router = Router();
const Quizzes = require("../models/Quizzes");

// get all quizzes

router.get("/all/generated/quizzes", async (req: any, res: any) => {
  try {
    let quizzes = await Quizzes.find({});
    if (quizzes?.length > 0) {
      quizzes?.forEach((element) => {
        element.questions = element?.questions?.slice(0, 3);
      });
    }
    return res.send(quizzes);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
