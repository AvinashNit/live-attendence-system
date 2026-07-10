import { z } from "zod";

export function validate< T >( schema : z.ZodType< T > ,data:unknown  )
{
     return function ( req: Request , res: Response )
     {
        const result =  schema.safeParse( data )
        if(!result.success )
        {
            throw result.error
        }
        return result.data;
     }
}