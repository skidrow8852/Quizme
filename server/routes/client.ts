import bcrypt from "bcrypt";
import { z } from "zod";
import { Router } from "express";
import { Token } from "../helpers/types";
import jwt from "jsonwebtoken";


const { verifyAccessToken } = require("../helpers/verifyTokens");

const router = Router();
const Client = require("../models/Client");
const { createToken } = require("../helpers/verifyTokens");

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Register new user
router.post("/add", async (req: any, res: any) => {
  try {
    let { email, password, fullName } = req.body;

    const validation = userSchema
      .extend({
        fullName: z.string().max(100),
        email: z.string().email(),
        password: z.string().min(8),
      })
      .safeParse(req.body);
    if (!validation.success) {
      return res.status(404).json({ errors: "Error with Data Sent" });
    }

    const exists = await Client.findOne({ email });

    if (exists) {
      return res.send({ status: "user already exists" });
    } else {

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await new Client({
        email: email,
        password: hash,
        fullName: fullName,
      }).save();
      const token = createToken(user?._id, email);

      return res.send({ email, token, id: user?._id });
    }
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

// Login user
let loginAttempts = {};
router.post("/login", async (req: any, res: any) => {
  try {
    let { email, password } = req.body;

    const maxAttempts = 3;
    const attemptWindowMs = 5 * 60 * 1000;

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

    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(404).json({ errors: "Error with Data Sent" });
    }
    const user = await Client.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user?.password);
      if (match) {
        loginAttempts[email] = { count: 0, lastAttempt: Date.now() };
        const token = createToken(user?._id?.toString(), email);

        return res.send({ email, token, id: user?._id });
      } else {
        return res.send({ status: "incorrect password" });
      }
    } else {
      return res.send({ status: "incorrect email" });
    }
  } catch (error) {
    res.send({ status: "error" });
  }
});


// Get Client Profile
router.get("/profile/:id", verifyAccessToken, async (req : any, res : any) => {
  try{
    const decodedToken = jwt.verify(
      req.headers.authorization!.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET!
    ) as Token;
    if (decodedToken?.id?.toLowerCase() !== req?.params?.id?.toLowerCase()) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }
    const data = await Client.findOne({_id : req?.params?.id}).select("-password")
    if(!data){
      return res.status(200).json({msg : "User not found"})
    }
    return res.send(data)

  }catch(e){
    res.send({ status: "error" });
  }
})


module.exports = router