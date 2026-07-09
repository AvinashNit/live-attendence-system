import { password } from "bun";
import { z } from "zod";

export const loginSchema =  z.object({
    email: z.email({
        error:"Please enter a valid email address"
    }).trim(),
    password:z.string().min(6 ,{
        error:" password must not be less than 6 characters"
    })
})


export const signupSchema = z.object({
    name : z.string().trim().min(1, {
        error: "Name must be non empty"
    }),
    email: z.email({
        error:"Please enter a valid email address"
    }).trim(),
    password: z.string().min(6,{
        error:"password must not be less than 6 characters"
    }),
    role : z.enum(["teacher", "student"], {
        error:" Role can only be either 'teacher' or 'student'"
    })
})


export const tokenSchem = z.object({
    token:z.string().trim().min(1, {
        error:"token cannot be null"
    })
})

export type SignUpBody = z.infer< typeof signupSchema >;
export type LoginBody = z.infer< typeof loginSchema >; 