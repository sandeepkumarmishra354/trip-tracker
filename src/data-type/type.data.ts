export type LoginMethod = 'google' | 'facebook' | 'phone';

interface ICommonUserData {
    username: string,
    email: string,
    fullname: string,
    photo: string,
    method: LoginMethod,
}

export interface IUserAuthData {
    username: string | null,
    email: string | null,
    fullname: string | null,
    photo: string | null,
    method: LoginMethod,
}
export interface ILoginData {
    username: string | null,
    method: LoginMethod | null
}
export interface IAuthResponseData extends ICommonUserData {
    id: string,
    createdAt: Date,
    sessionToken: string,
}
export interface IUserProfile extends ICommonUserData {
    id: string,
}