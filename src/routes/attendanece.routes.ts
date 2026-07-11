import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { startAttendanceSession } from "../controllers/attendance.controller";

const attendanceRouter =  express.Router();


attendanceRouter.post("/attendance/start", authMiddleware , startAttendanceSession )



export { attendanceRouter }