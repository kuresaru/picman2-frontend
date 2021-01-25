declare module Picman {
    export type RequestResult = {
        code: number,
        message: string,
        data: any,
    };
    export type UserDetail = {
        admin: boolean,
        sacUserPrincipal: {
            nickname: string,
            said: number,
            username: string,
        },
    };
    export type PicLibDetail = {
        lastUpdate: number,
        lid: number,
        name: string,
        picCount: number,
        readonly: boolean,
    };
}