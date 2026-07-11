import type { AuthenticatedWebSocket } from "../types/websocket";

import { session } from "../controllers/attendance.controller";

import { wss } from "../..";
import { Client } from "pg";

export function webSocketController( message : Record< string, unknown> ,ws: AuthenticatedWebSocket )
{
    const event = message.event;
    const { role , id } = ws.user;

    if( event === "ATTENDANCE_MARKED" && role ==="teacher" && session!==null )
    {
        wss.clients.forEach( client => client.send(
            JSON.stringify(
            {
                event:"ATTENDANCE_MARKED",
                data: message.data
            }
        )
        ))
    }

    if( event === "TODAY_SUMMARY" && role==="teacher" && session !==null )
    {
        const data  =  summaryManager( );
        wss.clients.forEach( client => client.send( JSON.stringify({
            event:"TODAY_SUMMARY",
            data
        })))
    }
    if( event === "MY_ATTENDANCE" && role === "student" && session !== null )
    {
        attendanceMaker( message , ws.user.id)
        wss.clients.forEach( ( client: AuthenticatedWebSocket )=> client)
    }
    if( event=== "DONE" && role === "teacher" && session!==null )
        persistToDB( );
}