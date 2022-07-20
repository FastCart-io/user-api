export interface AccessPayload {

    sub: string;
    username: string;
    email: string;
    expiration: string;
}

export interface RefreshPayload {


}

export interface DataPayload {

    data: AccessPayload;
    token: string;
    refresh: string;
}

export interface FullJwtPayload extends AccessPayload {

    iat: number;
    exp: number;
}
