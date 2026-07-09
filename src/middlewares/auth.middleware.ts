import type { Request, Response } from "express";
import { tokenSchem } from "../schemas/auth.schema";
import type { FailureResponse } from "../types/response.types";
import { verifyToken } from "../../utils/jwt.util";


export function authMiddleware( req: Request, res: Response)
{
    const  token    = req?.headers?.authorization?.split(" ")[1];

    const result = tokenSchem.safeParse({
        token
    })
    if(!result.success )
    {
        let response: FailureResponse< { field: string, message:string }[] > = {
            success:false,
            error: result.error.issues.map( issue => ({
                field: issue.path.join("."),
                message:issue.message
            }))
        } 
        return res.status(400).json( response );

    }
    try{
        const decoded = verifyToken( token! );
        req.user = decoded;
    }
    catch( err )
    {
        const response: FailureResponse< string > ={
            success:false,
            error: err instanceof Error ? err.message : "something went wrong"
        }
        return res.status( 400 ).json( response )
    }


}