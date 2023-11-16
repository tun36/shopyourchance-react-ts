
import { User,UserActionInterface,UserActionType } from "./types";

export function addUser(user: User): UserActionInterface {
	return {
		type: UserActionType.ADD_USER,
		payload: user,
	};
}
export function addCart(cart: User): UserActionInterface {
	return {
		type: UserActionType.ADD_CART,
		payload: cart,
	};
}
export function addResume(resume: User): UserActionInterface {
	return {
		type: UserActionType.ADD_RESUME,
		payload: resume,
	};
}