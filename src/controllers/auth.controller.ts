import { signupSchema , loginSchema, tokenSchem } from "../schemas/auth.schema";
import type { SignUpBody, LoginBody } from "../schemas/auth.schema"
import type { Request , Response } from "express";
import type { FailureResponse, SuccessResponse } from "../types/response.types";
import { createUser } from "../services/auth.service";
import type { User } from "../types/user.types";
import { loginLogic  } from "../services/auth.service";
import * as jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt.util";
import { findUserById } from "../repository/user.repo";

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
                data: createdUser
              } as SuccessResponse< User >
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


export async  function logIn( req: Request, res: Response  ) 
{
    const { email , password }  = req.body as LoginBody;
    const result = loginSchema.safeParse({
        email: email, 
        password:password
    })
    if( !result.success )
    {
        let response: FailureResponse<{ field: string, message: string}[]>  = {
            success:false,
            error: result.error.issues.map( issue => ({
                field : issue.path.join("."),
                message: issue.message
            }))
        
            
        }  
        return res.status(400).json( response )
    }
    try{
         const token =  await loginLogic( result.data )
         let response: SuccessResponse< { token: string , message: string}> = {
            success:true,
            data:{
                token,
                message:"You have been loggedIn successfully "
            }
           
           
        }
        return res.status(200).json( response )
    }
    catch( err: unknown ){
        let response: FailureResponse< string > = {
            success:false,
            error: err instanceof Error ? err.message : "Something went wrong"
        }
        return res.status(401).json(response)
    }
}
    

export async  function authenticate( req: Request, res: Response )
{
     const token = req.headers.authorization?.split(" ")[1];
     const result = tokenSchem.safeParse({
        token
     })
     if(!result.success)
     {
        let response: FailureResponse< { field: string, message: string}[]> = {
            success: false,
            error: result.error.issues.map( issue => ({
                field: issue.path.join("."),
                message:issue.message
            }))
        }
        return res.status(400).json( response )
     }
     try{
       const decoded =  verifyToken( token! );
       const user  = await findUserById( decoded.id );
       const { password , ...rest } =  user 
       const response: SuccessResponse< User > ={
        success:true, 
        data : rest
       }
       return res.status(200).json( response )
     }
     catch( err )
     {
        let response : FailureResponse < string > ={
            success:false,
            error: err instanceof Error ? err.message :" something went wrong"
        }
        return res.status(401).json( response )
     }
}