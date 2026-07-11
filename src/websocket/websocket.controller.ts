import type { AuthenticatedWebSocket } from "../types/websocket";

import { session } from "../controllers/attendance.controller";
import { makeEntryToDB, myAttendance, summaryManager  } from "./websocket.services";
import { wss } from "../..";

export async  function webSocketController( message : Record< string, unknown> ,ws: AuthenticatedWebSocket )
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
        const data  = await summaryManager( );
        wss.clients.forEach( client => client.send( JSON.stringify({
            event:"TODAY_SUMMARY",
            data
        })))
    }

    if( event === "MY_ATTENDANCE" && role === "student" && session !== null )
    {
        const status = myAttendance( ws.user.id )
        wss.clients.forEach((client) => {
            const ws1 = client as AuthenticatedWebSocket;
        
            if (ws1.user.id === ws.user.id) {
                ws1.send(
                    JSON.stringify({
                        event: "MY_ATTENDANCE",
                        status,
                    })
                );
            }
        });
    }


    if( event=== "DONE" && role === "teacher" && session!==null )
    {
        makeEntryToDB();
        wss.clients.forEach( async (client) => client.send(
            JSON.stringify({
                event:"DONE",
                data:{
                    message:"ATTENDANCE_PERSISTED",
                    ...(await summaryManager()),
                }
            })
        ))
    }
}