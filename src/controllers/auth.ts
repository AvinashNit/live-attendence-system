import { signupSchema , loginSchema } from "../schemas/auth.schema";

import type { 
    SignUpBody, LoginBody 
} from "../schemas/auth.schema"

import type { Request , Response } from "express";


async function signUp( req: Request, res : Response )
{
    const { name, email ,password  } = req.body as SignUpBody;
    const result = signupSchema.safeParse({
        name, email, password
    });
    if( !result.success )
    {
        return res.status(400).json({})
    }
}