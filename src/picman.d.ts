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
    export type PictureDetail = {
        pid: string,
        description: string,
        tags: string[],
        fileSize: number,
        width: number,
        height: number,
        createTime: number,
        lastModify: number,
        valid: boolean,
        accessLibrary: number,
    };
    export type UpdatePictureMetaRequest = {
        description: string,
        tags: string[],
    };
    export type UpdatePictureMetaResult = {
        accessLibrary: number,
        createTime: number,
        description: string,
        fileSize: number,
        height: number,
        lastModify: number,
        pid: string,
        tags: string[]
        valid: boolean,
        width: number,
    };
}