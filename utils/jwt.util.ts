import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "../src/types/jwt.types";
import type { hr } from "zod/locales";

export function generateToken( id: string, role : string )
{
    return jwt.sign({id,role}, "mysecretSEcret",{expiresIn: "2h"})
}


export  function verifyToken( token : string)
{
    try {
         const decoded =  jwt.verify( token ,"mysecretSEcret" ) as JwtPayload ;
         return decoded;
    }
    catch( err )
    {
        throw new Error("Invalid token")
    }
}