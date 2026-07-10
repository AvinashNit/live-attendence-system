
import { prisma } from "../config/prisma.config";

export const classRepApi ={
    createClass : async ( className : string , teacherId: string )=>
    {
        const createdClass   = await  prisma.class.create({
            data:{
                className : className ,
                teacherId: teacherId
            }
        })
        return createdClass;
    },
    
    classExist :  async ( classId : string )=>{
        const classExist = prisma.class.findFirst( {
            where:{
                id: classId
            }
        } )
        return classExist;
    }
}