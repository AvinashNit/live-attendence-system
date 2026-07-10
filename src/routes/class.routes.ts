import express from "express";
import { addStudent, createClass, fetchClassDetail, fetchMyAttendance } from "../controllers/class.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const classRouter  =  express.Router();


classRouter.post( "/class", authMiddleware , createClass );

classRouter.post("/class/:id/add-student" , authMiddleware , addStudent )

classRouter.get("/class/:id", authMiddleware , fetchClassDetail )


classRouter.get("/class/:id/my-attendance", authMiddleware ,fetchMyAttendance  )

export  { classRouter }