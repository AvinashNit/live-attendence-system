

export interface SuccessResponse< T > {
    success: true,
    data : T
}

export interface FailureResponse < T >
{
    success: false ,
    error: T
}


