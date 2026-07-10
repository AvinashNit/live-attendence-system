
import { prisma } from "../config/prisma.config"



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