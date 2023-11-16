

export interface User {
    firstname: string;
    lastname: string;
    carts:[];
    applys:[];
    resumes:[];
}
export interface UserState {
    User: User;
}
export enum UserActionType {
    ADD_USER = "ADD_USER",
    ADD_CART = "ADD_CART",
    ADD_RESUME = "ADD_RESUME"

}

export type UserAction = UserActionType;

export interface UserActionInterface {
    type: UserAction;
    payload: any;
}