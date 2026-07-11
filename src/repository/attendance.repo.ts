import { prisma } from "../config/prisma.config";
import { enrollmentApi } from "./enrollment.repo"



export async  function getAttendanceApi( enrollmentId: string )
{
    const attendance  =  await prisma.attendance.findMany({
        where:
        {
            id: enrollmentId
        }
    })
    return attendance
}



export async function makeAttendance( userId: string, classId: string, status:"present"|"absent" )
{
    const enrollment = await enrollmentApi.getEnrollment( classId, userId );
    if( enrollment === null )
        return null;
    const attend =  await prisma.attendance.create( {
        data:{
            enrollmentId: enrollment.id as string,
            status:status,
            date: new Date()
        }
    })
    return attend;

}