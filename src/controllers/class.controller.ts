import { validate } from "../../utils/zodvalidation"
import { classIdSchema, classSchema } from "../schemas/class.schema"
import type { Request, Response } from "express"
import type { FailureResponse, SuccessResponse } from "../types/response.types"
import { classService } from "../services/class.service"
import { studentApi } from "../repository/student.repo"
import { success } from "zod"


export async function createClass( req: Request, res: Response ){
    const { classname } = req.body 
    const { id , role } = req.user!
    console.log( id, role )
    if( role === "student")
         return res.status(403).json({ success:false, error: "Student not allowed to do this action"} as FailureResponse< string >)

    const classResult =  classSchema.safeParse({
        classname
    })

    if( !classResult.success )
    {
        let response: FailureResponse<{field: string, message:string}[]> = {
            success:false,
            error: classResult.error.issues.map( issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        }
        return res.status( 400 ).json( response )
    }

    try{
        const createdClass = await classService.createClass( classResult.data.classname , id )
        return res.status(201).json(
            {
            success: true,
            data: createdClass
        } as SuccessResponse< {
            id: string,
            className: string,
            teacherId: string
            studentIds : unknown[]

        }>)
    }
    catch( err )
    {
        return res.status(500).json({
            success:false,
            error : err instanceof Error ? err.message :" Something went wrong"
        })
    }
   
     
}


export async function addStudent( req: Request, res: Response )
{
    console.log( "addstudent entered")
    const role = req.user?.role;
    if( !role || role ==="student" )
        return res.status( 403 ).json({
            success:false,
            error: "Unauthorized"
    } as FailureResponse< string >)

    const studentId = req.body.studentId;
    const studentResult = classIdSchema.safeParse({
        classId: studentId
    })
   
    console.log( studentId )
    if( !studentResult.success )
    {
        console.log("inside studentId parser")
        return res.status(400).json({
            success:false, 
            error: studentResult.error.issues.map( issue => (
                {
                    field: issue.path.join("."),
                    message: issue.message
                }
            ))
        } as FailureResponse<{ field: string, message: string }[]>)
    }

    const classId  = req.params.id;
    console.log( classId )
    const classResult = classIdSchema.safeParse({
        classId
    })

    if( !classResult.success )
    {
        return res.status(400).json({
            success:false, 
            error: classResult.error.issues.map( issue => (
                {
                    field: issue.path.join("."),
                    message: issue.message
                }
            ))
        } as FailureResponse<{ field: string, message: string }[]>)
    }

    try{
        const studentAdded = await  classService.addStudent( studentResult.data.classId, classResult.data.classId )
        return res.status( 201 ).json({
            success:true,
            data:{
                className: studentAdded.className,
                classId: studentAdded.classId,
                studentName:studentAdded.studentName,
                studentId:studentAdded.studentId
            }
        } as SuccessResponse< {
            className: string,
            classId: string,
            studentName: string,
            studentId: string,
        }>)
    }
    catch( err )
    {
        return res.status( 403 ).json({
            success:false,
            error : err instanceof  Error ? err.message : "something went wrong" 
        })
    }
}


export async function fetchClassDetail( req:Request, res:Response )
{
    const classId = req.params.id;
    const studentId = req.user?.id;
    const role = req.user?.role;

    const validatedClassId = classIdSchema.safeParse({
        classId
    })

    if(!validatedClassId.success )
    {
        return res.status(400).json({
            success:false,
            error: validatedClassId.error.issues.map( issue => ({
                field: issue.path.join("."),
                message:issue.message
            }))
        } as FailureResponse<{ field: string, message: string}[]>)
    }
    try{

        const detail = await  classService.fetchClassDetail( validatedClassId.data.classId )
        let studentEnrolled = detail.students.find( student =>  student.user.id === studentId )
        console.log( "userEnrolled" , studentEnrolled )
        console.log( role )
        if( role === "teacher" || studentEnrolled )
            return res.status(200).json({
            success:true,
            data: detail,
        })

        else
            throw new Error("You are not a part of the specified class")

    }
    catch( err )
    {
        return res.status( 403 ).json({
            success: false,
            error: err instanceof Error ? err.message : "something went wrong"
        })
    }
}


export function fetchMyAttendance( req: Request, res: Response )
{
    const studentId = req.user?.id;

    const classId = req.params.id;

    const validatedClassId = classIdSchema.safeParse( {
        classId
    })

    const validatedStudentId =  classIdSchema.safeParse( {
        classId:studentId 
    })

    if( !validatedClassId.success )
        return res.status( 400 ).json({
            success: false,
            error:  validatedClassId.error.issues.map( issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
    } as FailureResponse<{ field: string, message: string}[]>)

    if( !validatedStudentId.success )
        return res.status( 400 ).json({
            success: false,
            error:  validatedStudentId.error.issues.map( issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
    } as FailureResponse<{ field: string, message: string}[]>)
    try{
        const attendance = classService.fetchMyAttendance( validatedClassId.data.classId, validatedStudentId.data.classId )
        if(!attendance )
            {
                return res.status( 500 ).json({
                    success:false,
                    error: "Something went wrong"
                })
            } 
        return res.status( 200 ).json({
            success:true,
            data: attendance
        })
    }
    catch( err )
    {
        return res.status( 403 ).json({
            success:false,
            error: err instanceof Error ? err.message : "something went wrong"
        })
    }

}