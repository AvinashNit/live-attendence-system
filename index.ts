import express from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth.routes";

const app =  express();
app.use( express.json() );

app.use( cors() )

app.use( authRouter );


app.listen( 3000, ()=>{
    console.log(" Server is running over 3000")
})