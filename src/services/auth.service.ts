
import { hashPassword } from "../../utils/hashpassword.utils.ts";
import type { SignUpBody } from "../schemas/auth.schema.ts";
import type { User } from "../types/user.types.ts";
import { makeUserEntry, userExists  } from "../repository/user.repo.ts";



export async  function createUser ( userBody : SignUpBody ): Promise< User >
{
    const isUserPresent  = await userExists( userBody.email )
    if( isUserPresent )
        throw new Error("User already exist");

    const user =  await makeUserEntry( userBody ) ;

    return user;
}