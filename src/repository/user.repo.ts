import { hashPassword } from "../../utils/hashpassword.utils";
import { prisma } from "../config/prisma.config"
import type { SignUpBody } from "../schemas/auth.schema"
import type { User } from "../types/user.types"

export async function makeUserEntry( user: SignUpBody ){

    const newCreatedUser  =  await prisma.user.create({
        data:{
            email: user.email,
            password:await hashPassword( user.password),
            name: user.name,
            role:user.role


        }
    });
    return newCreatedUser;
}

export async function findUserByEmail( email: string ){
    const user =  await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if( user )
    {
        
        return user;
    }
    else
        throw new Error(`User with email ${ email } not found`)
    
}


export async function findUserById( id : string )
{
    const user =  await prisma.user.findUnique({
        where:{
            id: id
        }
    })
    if( user )
    {
       
        return user;
    }
    else
        throw new Error(`User with id ${ id } not found`)
}


export async function userExists( email: string )
{
    const userExists = await prisma.user.findFirst({
        where:{
            email: email
        }
    })
    return userExists ?  true : false
}


