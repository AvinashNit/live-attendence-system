import { signupSchema , loginSchema } from "../schemas/auth.schema";

import type { 
    SignUpBody, LoginBody 
} from "../schemas/auth.schema"

import type { Request , Response } from "express";
import type { FailureResponse, SuccessResponse } from "../types/response.types";
import { createUser } from "../services/auth.service";
import type { userCreatedBody } from "../types/user.types";


 export async function signUp( req: Request, res : Response )
{
    const { name, email ,password ,role  } = req.body as SignUpBody;
    const result = signupSchema.safeParse({
        name, email, password ,role 
    });
    if( !result.success )
    {
        let response : FailureResponse < { field: string , message : string }[] > = {
            success :false ,
            error : result.error.issues.map( issue => (
                {
                    field: issue.path.join( "."),
                    message: issue.message
                }
            ))
        }
        return res.status(400).json( response );
    }
        try{
             const createdUser = await createUser( { name, email, password, role });
             return res.status(201).json( {
                success: true,
                data:{
                    id: createdUser.id,
                    name:createdUser.name,
                    email: createdUser.email,
                    role: createdUser.role
                    

                }
              } as SuccessResponse< userCreatedBody >
            )
        }
    
        catch( err: unknown  )
        {
            let response: FailureResponse < string >= {
                success:false,
                error : err instanceof Error ? err.message : " Something happened wrong"
            }
            return res.status(400).json( response )
        }
           
}
    

