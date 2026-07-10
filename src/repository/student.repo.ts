import { prisma } from "../config/prisma.config"


export const studentApi = {
    getStudentProfile:  async ( studentId : string )=>{
        const existingStudent =  await prisma.user.findFirst( {
            where:{
                id: studentId
            }
        } )
        return existingStudent;
    }
    
}