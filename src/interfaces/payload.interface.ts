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
