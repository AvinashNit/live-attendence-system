import express from "express";
import { signUp } from "../controllers/auth.controller";

const authRouter  =  express.Router();


authRouter.post("/auth/v1/signup" , signUp );

export { authRouter }
