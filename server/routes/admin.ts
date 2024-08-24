import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Attendants, Token } from "../helpers/types";
const Admins = require("../models/Admin");
const path = require("path");
const router = Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const Clients = require("../models/Client");
const Statement = require("../models/Statement");
const Quizzes = require("../models/Quizzes");
const { verifyAdminAccessToken, createAdminToken } = require("../helpers/verifyTokens");

async function generateUsers(num: number) {
  let users: Attendants[] = [];
  const { nanoid } = await import("nanoid");

  for (let i = 0; i < num; i++) {
    users.push({
      username: `${nanoid(5)}`,
      password: `${nanoid(5)}-${nanoid(5)}`,
      date: new Date(),
      isFinished: false,
      lastScore: [],
    });
  }

  return users;
}

let storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: async (req: any, file: any, cb: any) => {
    const { fileTypeFromBuffer } = await import("file-type");
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    const fileBuffer = await file.buffer;
    const fileTypeResult = await fileTypeFromBuffer(fileBuffer);
    if (
      !allowedExtensions.includes(ext) &&
      (!fileTypeResult ||
        !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(fileTypeResult.mime))
    ) {
      return cb(new Error("Only supported image files are allowed"), false);
    }
    cb(null, true);
  },
});

let uploadImage = multer({ storage: storage }).single("file");

// Upload new image/Thumbnail

router.post("/upload/:admin", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }
    uploadImage(req, res, (err) => {
      if (err) {
        return res.json({ success: false, err });
      }
      return res.json({
        success: true,
        filePath: res.req.file.path,
        fileName: res.req.file.filename,
      });
    });
  } catch (error) {
    res.send(error);
  }
});


// Login Admin

// eslint-disable-next-line prefer-const
let loginAttempts = {};
router.post("/login", async (req: any, res: any) => {
  try {
    const { password, username } = req.body;
    const maxAttempts = 3;
    const attemptWindowMs = 5 * 60 * 1000;
    const email = req?.body?.username;

    const AdminSchema = z.object({
      username: z.string().email(),
      password: z.string().min(12),
    });

    if (
      loginAttempts[email] &&
      loginAttempts[email].count >= maxAttempts &&
      Date.now() - loginAttempts[email].lastAttempt < attemptWindowMs
    ) {
      return res.status(429).json({ error: "Too many login attempts. Please try again later." });
    }
    loginAttempts[email] = {
      count: (loginAttempts[email]?.count || 0) + 1,
      lastAttempt: Date.now(),
    };

    const validation = AdminSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: [{ msg: "Error with Data Sent" }] });
    }

    const admin = await Admins.findOne({ email: email });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin?.password);
      if (passwordMatch) {
        loginAttempts[email] = { count: 0, lastAttempt: Date.now() };
        const token = createAdminToken(admin?._id?.toString(), username);
        return res.send({ username, token, id: admin?._id });
      } else {
        return res.send({ status: "incorrect key or password" });
      }
    } else {
      return res.send({ status: "incorrect username" });
    }
  } catch (e) {
    res.send({ error: true });
  }
});


// Check for admin validity
router.get("/valid/:email", async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.body?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    // Find the user by email
    let user = await Admins.findOne({ email: req?.params?.email }).select("-password");

    if (user) {
      return res.status(200).json({ status: "success" });
    } else {
      return res.status(404).json({ status: "not found" });
    }
  } catch (error) {
    res.send({ status: "not found" });
  }
});

// get All Clients

router.get("/clients/:admin", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const clients = await Clients.find({}).populate("generatedQuizes");
    return res.send(clients);
  } catch (e) {
    res.send(e);
  }
});

// get All Statements

router.get("/all/generated/statements/:admin", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const quizzes = await Statement.find({}).populate("client").populate("quizId");
    return res.send(quizzes);
  } catch (e) {
    res.send(e);
  }
});



// get All Quizzes

router.get("/all/created/quizzes/:admin", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const quizzes = await Quizzes.find({})
    return res.send(quizzes);
  } catch (e) {
    res.send(e);
  }
});

// Edit generated Quiz

router.put("/generated/statement/:id", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.body?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }
    const quizSchema = z.object({
      isApproved: z.boolean(),
      numOfUsers: z.number(),
      admin: z.string(),
      attendants : z?.string().optional()
    });
    const validation = quizSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: [{ msg: "Error with Data Sent" }] });
    }

    const { isApproved, numOfUsers, attendants } = req.body;

    const users = numOfUsers > 0 ? await generateUsers(numOfUsers) : attendants;
    let values = {
      isApproved: isApproved,  numOfUsers: numOfUsers 
    }
    if(users?.length > 0){
      values["attendants"] = users
    }
    const quizzes = await Statement.findOneAndUpdate(
      { _id: req.params.id },
      {... values}
    )
      .populate("client")
      .populate("quizId");
    return res.send(quizzes);
  } catch (e) {
    res.send(e);
  }
});

/// Add a Quiz
router.post("/quiz/add", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.body?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const quizSchema = z.object({
      admin: z.string(),
      intro : z.string().optional(),
      title: z.string(),
      thumbnail: z.string().optional(),
      results: z
        .array(
          z.object({
            range: z.string(),
            message: z.string(),
          })
        )
        .optional(),
      questions: z?.array(
        z.object({
          id: z.number(),
          title: z.string(),

          answers: z?.array(
            z.object({
              key: z.number(),
              value: z.string(),
              points: z.number(),
            })
          ),
        })
      ),
    });
    const validation = quizSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: [{ msg: validation.error }] });
    }

    const { title, thumbnail, questions, description, results,  intro } = req.body;

    const quizzes = await new Quizzes({
      intro,
      title,
      thumbnail: thumbnail ? thumbnail : "",
      questions,
      description,
      results: results?.length > 0 ? results : [],
    }).save();
    if(quizzes){

      return res.send({status : "success", quizzes});
    }else{
      return res.status(404).json({msg : "error"})
    }
  } catch (e) {
    return res.status(404).json({msg : "error"})
  }
});

/// Modify a Quiz
router.put("/quiz/modify", verifyAdminAccessToken, async (req: any, res: any) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.body?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const quizSchema = z.object({
      admin: z.string(),
      intro: z.string().optional(),
      quizId: z.string(),
      title: z.string().optional(),
      thumbnail: z.string().optional(),
      description: z.string().optional(),
      results: z
        .array(
          z.object({
            range: z.string(),
            message: z.string(),
          })
        )
        .optional(),
      questions: z
        ?.array(
          z.object({
            id: z.number(),
            title: z.string(),

            answers: z?.array(
              z.object({
                key: z.number(),
                value: z.string(),
                points: z.number(),
              })
            ),
          })
        )
        .optional(),
    });
    const validation = quizSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: [{ msg: validation.error }] });
    }

    let values: any = {};
    const fieldsToUpdate = ["title", "thumbnail", "questions", "results", "intro", "description"];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        values[field] = req.body[field];
      }
    });
    if (Object.keys(values)?.length > 0) {
      const quiz = await Quizzes.findOneAndUpdate(
        {
          _id: req?.body?.quizId,
        },
        { ...values },
        { new: true }
      );
      return res.send({status : "success", quiz : quiz});
    } else {
      res.status(200).json({ status: "nothing updated" });
    }
  } catch (e) {
    res.send(e);
  }
});


router.delete("/delete/quiz/:id/user/:admin", async (req: any, res: any) => {

  try{
     const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET_ADMIN!
    ) as Token;
    if (
      decodedToken?.id?.toLowerCase() !== req?.params?.admin?.toLowerCase() &&
      decodedToken?.email !== `${process.env.MAIN_EMAIL}`
    ) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const data = await Quizzes.findByIdAndDelete({_id : req?.params?.id})
    if (!data) {
      return res.status(404).json({ errors: [{ msg: "Article not found" }] });
    }
    return res.status(200).json({ msg: "success" });
  }catch(e){
    res.status(404).json({msg : "error"})
  }

})

module.exports = router;
