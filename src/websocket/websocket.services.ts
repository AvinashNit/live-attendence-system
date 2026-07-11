import { enrollmentApi } from "../repository/enrollment.repo";

const ATTENDANCE:  {
    studentId: string,
    status: string
}[] =  [];

import { session } from "../controllers/attendance.controller";
import { makeAttendance } from "../repository/attendance.repo";

export function markAttendance( message : Record< string, unknown > , userId: string )
{
    ATTENDANCE.push( {
        studentId: userId,
        status: "present"
    })
}


export async function summaryManager( )
{
    const enrollment = await  enrollmentApi.getAllEnrolment( session!.classId );
    return {
        present: ATTENDANCE.length,
        absent: enrollment.length - ATTENDANCE.length,
        total: enrollment.length
    }
}


export function myAttendance( userId: string   ){
    const present = ATTENDANCE.find( attend  => attend.studentId === userId )
    if( present )
        return "present"
    else
        return "Not marked yet";


}


export async function makeEntryToDB()
{
   const allEnrollment = await enrollmentApi.getAllEnrolment( session!.classId );
   allEnrollment.forEach( async( enrolled )=> {
    const isEnrolledPresent  = ATTENDANCE.find( attend =>  attend.studentId === enrolled.user.id )
    if( isEnrolledPresent )
        await makeAttendance( enrolled.user.id , session!.classId, "present" );
    else
        await makeAttendance( enrolled.user.id , session!.classId ,"absent")
   })
}