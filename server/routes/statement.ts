import jwt from "jsonwebtoken";
import { z } from "zod";
import { Token } from "../helpers/types";
import { Router } from "express";

const router = Router();
const Statement = require("../models/Statement");
const Client = require("../models/Client");

const { verifyAccessToken, createUserToken } = require("../helpers/verifyTokens");

// get all client statements
router.get("/all/generated/statements/:id", verifyAccessToken, async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.ACCESS_TOKEN_SECRET) as Token;

    if (decodedToken?.id.toLowerCase() !== req.params.id.toLowerCase()) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    let quizzes = await Statement.find({ client: req.params.id }).populate("quizId").lean();

    let modifiedQuizzes = quizzes.map((element) => {
      if (!element.isApproved) {
        element.quizId = element.quizId.map((val) => ({ _id: val._id, title : val.title, description : val.description, thumbnail : val.thumbnail }));
      }
      return element;
    });

    return res.json(modifiedQuizzes);

  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
});



// add a new statement submition

router.post("/new/statement/:id", verifyAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET!
    ) as Token;
    if (decodedToken?.id?.toLowerCase() !== req?.params?.id?.toLowerCase()) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const QuizSchema = z.object({
      quizId: z.array(z.string()),
      numOfUsers: z.number(),
      companyName: z.string(),
    });
    const validation = QuizSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(404).json({ errors: "Error with Data Sent" });
    }
    let price = req?.body?.numOfUsers * 100 + req?.body?.quizId?.length * 350;
    let quiz = await new Statement({
      client: req?.params?.id,
      quizId: req?.body?.quizId,
      numOfUsers: req?.body?.numOfUsers,
      companyName: req?.body?.companyName,
      price: price,
    }).save();
    if (quiz) {
      await Client.findOneAndUpdate(
        { _id: req?.params?.id },
        {
          $push: {
            generatedQuizes: quiz?._id,
          },
        }
      );
       quiz = await Statement.findById(quiz._id).populate('quizId').lean();
       
      quiz.quizId = quiz?.quizId?.map((val) => ({ _id: val._id, title : val.title, description : val.description, thumbnail : val.thumbnail }));
      
      return res.send(quiz);
    } else {
      return res.status(404).json({ msg: "error" });
    }
  } catch (e) {
    res.send(e);
  }
});

// Authenticate Generated user

router.post("/user/quiz", async (req: any, res: any) => {
  try {
    const QuizSchema = z.object({ username: z.string(), password: z.string(), quizId: z.string() });
    const validation = QuizSchema.safeParse(req.body);
   

    if (!validation.success) {
      return res.status(404).json({ errors: "Error with Data Sent" });
    }

    let quiz = await Statement.findOne({
      _id: req.body.quizId,
      isApproved: true,
      attendants: {
        $elemMatch: {
          username: req?.body?.username,
          password: req?.body?.password,
        },
      },
    });
    if (quiz) {
      const token = createUserToken(req.body.quizId, req?.body?.username);
      return res.send({ token: token, quizId: req.body.quizId, username : req?.body?.username });
    } else {
      return res.send({ status: "user not found, or incorrect credentials" });
    }
  } catch (e) {
   return res.send({ status: "user not found, or incorrect credentials" });
  }
});

// Get Quiz data for Generated user

router.get("/user/quiz/:id/user/:userId", async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_USER!
    ) as any;
    if (decodedToken.exp < Date.now() / 1000) {
      // Token is expired
      return res.status(401).json({ errors: [{ msg: "Token expired" }] });
    }
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.id?.toLowerCase() &&
      decodedToken?.username?.toLowerCase() !== req?.params?.userId?.toLowerCase()
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    let quiz = await Statement.findOne({
      _id: req?.params?.id,
      isApproved: true,
      attendants: {
        $elemMatch: {
          username: req?.params?.userId,
        },
      },
    }).populate({
      path: "quizId",
      select: "questions title description _id answers",
    });
    if (quiz) {
      return res.send({status : "success", quiz});
    } else {
      return res.send({ status: "quiz not found" });
    }
  } catch (e) {
    return res.send({ status: "quiz not found" });
  }
});

// Submit a Quiz data for Generated user

router.post("/submit/quiz", async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_USER!
    ) as any;
    if (decodedToken.exp < Date.now() / 1000) {
      // Token is expired
      return res.status(401).json({ errors: [{ msg: "Token expired" }] });
    }
    if (
      decodedToken?.id?.toLowerCase() !== req?.body?.quizId?.toLowerCase() &&
      decodedToken?.username?.toLowerCase() !== req?.body?.username?.toLowerCase()
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const QuizSchema = z.object({
      username: z.string(),
      quizId: z.string(),
      answers: z.array(
        z.object({
          quizId: z.string(),
          points : z?.number(),
          questionId : z?.number(),
          selectedAnswer : z?.object({key : z?.number(), points : z?.number(), value : z.string()})
        })
      ),
    });
    const validation = QuizSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(404).json({ errors: "Error with Data Sent" });
    }

    let quiz = await Statement.findOne({
      _id: {
        $in: req.body.quizId,
      },
      isApproved: true,
       attendants: {
        $elemMatch: {
          username: req?.body?.username
        },
      },
    }).populate({
      path: "quizId",
      select: "questions title description answers",
    });
    if (quiz) {
      const userAnswers = req?.body?.answers;
      let finalResult = [];

      quiz?.quizId?.map((element) => {
        let score: number = 0;
        let result: string = "";
        let id = userAnswers?.find((ids) => ids?.quizId == element?._id)?.quizId;
        if (id) {
          element?.questions?.forEach((question) => {
            if (
              question?.id == userAnswers?.find((ds) => ds?.questionId == question?.id)?.questionId &&
              id == element?._id
            ) {
              score += question?.answers?.find(
                (ds) =>
                  ds?.key ==
                  userAnswers?.find((ds) => ds?.questionId == question?.id && ds?.quizId == element?._id)
                    ?.selectedAnswer?.key
              )?.points;
            }
          });
          for (const item of element?.results || []) {
            const [min, max] = item.range.split("-").map(Number);

            if (score >= min && score <= max) {
              result = item.message;
              break;
            }
          }
          finalResult.push({ quizId: id, score: score, message: result });
        }
      });

      await Statement.findOneAndUpdate(
        {
          _id: req?.body?.quizId,
          isApproved: true,
          attendants: {
            $elemMatch: {
              username: req.body.username,
              isFinished : false
            },
          },
        },
        {
          $set: {
            "attendants.$.date": new Date(),
            "attendants.$.isFinished": true,
            "attendants.$.lastScore": finalResult,
          },
        },
        { new: true }
      );
      return res.send({ status : "success",score: finalResult });
    } else {
      return res.send({ status: "quiz not found" });
    }
  } catch (e) {
    console.log(e)
    return res.send(e);
  }
});

/// check if the Statement is approved
router.get("/generated/test/:id", async (req: any, res: any) => {
  try {
    
    let quiz = await Statement.findOne({ _id: req.params.id, isApproved : true })

    if(quiz){
      return res.status(200).json({msg : "success"})
    }

    return res.status(400).json({msg : "error"})
  } catch (e) {
    return res.status(400).json({msg : "error"})
  }
});


module.exports = router;
