import type { Request, Response } from "express";
import  { classIdSchema } from "../schemas/class.schema";
import { success } from "zod";

 export let session : null | {
    classId: string,
    startedAt: string
 } = null;


export function startAttendanceSession( req: Request, res: Response ){

    const { classId } = req.body;
    const id = req.user?.id;
    const role = req.user?.role;

    const validatedClassId =  classIdSchema.safeParse({
        classId
    })

    if( !validatedClassId.success )
    {

    }
    try{
        if( role === "student" )
            throw new Error("Student is not allowed to this task ")
        if( session )
            throw new Error("A session is already going try after some time")
        
        
         session = {
            classId: classId,
            startedAt: new Date().toISOString()

         }
         return res.status( 200 ).json({
            success:true, 
            data :session
         })

    }

    catch( err )
    {
         return res.status( 403 ).json({
            success:false,
            error: err instanceof Error ? err.message : "Something went wrong"
         }) 
         
    }

}