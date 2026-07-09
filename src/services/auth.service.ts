
import { hashPassword } from "../../utils/hashpassword.utils.ts";
import { prisma } from "../config/prisma.config.ts";
import type { SignUpBody } from "../schemas/auth.schema.ts";
import type { userCreatedBody } from "../types/user.types.ts";

export async  function createUser( userBody : SignUpBody ): Promise< userCreatedBody >
{
    const existingUser  = await prisma.user.findFirst({
        where:{
            email: userBody.email
        }
    })
    if( existingUser )
        throw new Error("User already exist");

    const user =  await prisma.user.create({
        data:{
            email: userBody.email,
            name: userBody.name,
            password: await hashPassword( userBody.password ),
            role: userBody.role
        } 
        
    }) as userCreatedBody;

    return user;
}