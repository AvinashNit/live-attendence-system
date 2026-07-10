import { wss  } from "../../index"




export function intializeWebsocket()
{
    wss.on("connection", ( ws )=>{
    console.log(" client connected ")

    ws.on("message", message =>{
        console.log("received ", message.toString() )
    })

    ws.on("close", ()=>{
        console.log("Disconnected")
    })
})
}




