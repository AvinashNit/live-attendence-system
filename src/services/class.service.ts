import { classRepApi } from "../repository/class.repo"
import { studentApi } from "../repository/student.repo";
import { enrollmentApi } from "../repository/enrollment.repo";
import { userExists } from "../repository/user.repo";
import {  getAttendanceApi } from "../repository/attendance.repo";

export const classService = {
    createClass :  async ( className:string, teacherId: string )=>{
        const classCreated = await classRepApi.createClass( className , teacherId );
        return {...classCreated, studentIds: []} as {
            id: string,
            className:string,
            teacherId: string,
            studentIds: unknown[]
        }
    },


    addStudent:  async ( studentId: string , classId: string )=>
    {
          const existingClass =  await classRepApi.classExist( classId );
          if( !existingClass )
            throw new Error("Incorrect classId");

          const existingStudent  = await studentApi.getStudentProfile( studentId );
          if( !existingStudent )
            throw new Error("No student with this id exist");

          const enrollment = enrollmentApi.makeEnrollment( studentId , classId );
          return {
            classId: existingClass.id,
            studentId: existingStudent.id,
            className : existingClass.className,
            studentName: existingStudent.name
          }
    },

    fetchClassDetail : async ( classId : string ) =>{

        const classDetail  =  await classRepApi.classExist( classId );

        if(!classDetail)
            throw new Error("No such class exist");

        const students  =  await enrollmentApi.getAllEnrolment( classId );

        return {
            classDetail,
            students
            }
        
    },

    fetchMyAttendance: async ( classId: string, studentId: string ) =>{

        const studentProfile = await studentApi.getStudentProfile ( studentId );
        const classDetail = await classRepApi.classExist( classId );

        if( !studentProfile || !classDetail )
            throw new Error("No such user or class exists ");

        const enrollment = await enrollmentApi.getEnrollment( classId, studentId )

        if( !enrollment )
            throw new Error( "No such entry exists")

        const attendance = await getAttendanceApi( enrollment.id! )
        let absent = 0;
        let present = 0 ;
        const attendanceDetail = attendance.map( attend => ({
            date: attend.date,
            status: attend.status
        }))
        attendance.forEach( attend => {
            if( attend.status ==="absent")
                absent++;
            else if( attend.status === "present" )
                present++;
        })
        return {
            id: studentProfile.id,
            name: studentProfile.name,
            class: classDetail.className,
            teacherId: classDetail.teacherId,
            attendance: attendanceDetail
        }


    }

}



