import { prisma } from "../config/prisma.config"



export const enrollmentApi = {
    makeEnrollment: async ( studentId: string , classId: string )=>
    {
        const enrollment = await prisma.enrollment.create({
            data:{
                userId: studentId,
                classId: classId
            }
        })
        return enrollment;
    },
    getAllEnrolment: async( classId : string )=>
    {
        const enrollments = await prisma.enrollment.findMany({
                    where: { classId },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
        return enrollments;
    },

    getEnrollment : async  function ( classId: string, studentId: string ): Promise< Record< string, string > | null > 
    {
        const enrollment = await prisma.enrollment.findFirst( {
            where:{
                classId,
                userId: studentId
            }
        })
        return enrollment;
    }
}