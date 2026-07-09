import { prisma } from "../config/prisma.config"
import type { SignUpBody } from "../schemas/auth.schema"
import type { User } from "../types/user.types"

export async function makeUserEntry( user: SignUpBody ): Promise< User >{

    const newCreatedUser  =  await prisma.user.create({
        data:{
            email: user.email,
            password:user.password,
            name: user.name,
            role:user.role


        }
    })
    const { password, ...rest  } = newCreatedUser;
    return rest;
}

export async function findUserByEmail( email: string ): Promise< User>{
    const user =  await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if( user )
    {
        const { password ,...rest } = user ;
        return rest;
    }
    else
        throw new Error(`User with email ${ email } not found`)
    
}


export async function findUserById( id : string ): Promise< User >
{
    const user =  await prisma.user.findUnique({
        where:{
            id: id
        }
    })
    if( user )
    {
        const { password , ...rest } = user;
        return rest;
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