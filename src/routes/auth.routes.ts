import express from "express";
import { logIn, signUp ,authenticate } from "../controllers/auth.controller";

const authRouter  =  express.Router();


authRouter.post("/auth/v1/signup" , signUp );
authRouter.post("/auth/v1/login", logIn )
authRouter.get("/auth/v1/me", authenticate )

export { authRouter }
