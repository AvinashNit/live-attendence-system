
import type { SignUpBody ,LoginBody  } from "../schemas/auth.schema.ts";
import type { User } from "../types/user.types.ts";
import {  findUserByEmail, makeUserEntry, userExists  } from "../repository/user.repo.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.util.ts";


export async  function createUser ( userBody : SignUpBody ): Promise< User >
{
    const isUserPresent  = await userExists( userBody.email )
    if( isUserPresent )
        throw new Error("User already exist");

    const user =  await makeUserEntry( userBody ) ;

    const { password, ...rest } = user;
    return rest;
}


export async function loginLogic( user: LoginBody )
{
        const existingUser  = await findUserByEmail( user.email );
        if( !existingUser )
        throw new Error("No such user found")
        console.log("hashedpasswrod ", existingUser.password);
        console.log("user entered ", user.password)
        const isMatch = await bcrypt.compare( user.password, existingUser.password );
        console.log("match ", isMatch)
        if( !isMatch )
            throw new Error("Wrong password");
        const token = generateToken( existingUser.id, existingUser.role );
        return token;
       


      
}