import express from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth.routes";
import { classRouter } from "./src/routes/class.routes";

import { WebSocketServer  } from "ws";
import { createServer } from "http";

import { intializeWebsocket  } from "./src/websocket/websocket";

import { attendanceRouter } from "./src/routes/attendanece.routes";


const  app =  express();
app.use( express.json() );

app.use( cors() )

app.use( authRouter );

app.use( classRouter )

app.use( attendanceRouter )

const  server = createServer( app );

export const wss = new WebSocketServer({
     server,
     path:"/ws"
})

intializeWebsocket();

 server.listen( 3000, ()=>{
    console.log(" Server is running over 3000")
})