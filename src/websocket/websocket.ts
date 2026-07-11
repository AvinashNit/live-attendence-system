import { verify } from "jsonwebtoken"
import { wss  } from "../../index"


import type { Request } from "express"
import { verifyToken } from "../../utils/jwt.util"
import type { AuthenticatedWebSocket } from "../types/websocket"
import { webSocketController } from "./websocket.controller"

export function intializeWebsocket()
{
    wss.on("connection", ( ws: AuthenticatedWebSocket , req  )=>{

    console.log(" client connected ")

    const url = new URL( req.url!, "http://localhost")


    const token = url.searchParams.get( "token" )
    if(!token )
    {
        ws.close( 1008, "No token")
        return;
    }
    try{
        const decoded = verifyToken( token! );
        ws .user = decoded;
    }
    catch( err ){
        ws.close( 1008, "Invalid token")
    }


    ws.on("message", ( message :{ 
        event: string,
        data: Record< string, string >
    } )=> {
        webSocketController( message ,ws )
    })

    ws.on("close", ()=>{
        console.log("Disconnected")
    })
})
}




