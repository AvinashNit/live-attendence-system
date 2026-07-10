import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const attendanceRouter =  express.Router();


attendanceRouter.post("/attendance/start", authMiddleware ,startAttendanceSession )



export { attendanceRouter }