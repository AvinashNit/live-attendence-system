
const ATTENDANCE:  {
    studentId: string,
    status: string
}[] =  [];


export function markAttendance( message : Record< string, unknown > , userId )
{
    ATTENDANCE.push( {
        studentId: userId,
        status: "present"
    })
}

