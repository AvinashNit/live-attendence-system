import { z }  from "zod";

export const classSchema  =  z.object({
    classname: z.string().trim().min(1, {
        error: "classname cannot be empty"
    })
})


export const classIdSchema = z.object({
    classId : z.string().trim().min(1,{error:
        "class id cannot be empty"
    })
})