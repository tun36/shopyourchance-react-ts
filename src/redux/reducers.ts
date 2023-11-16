import {UserState,UserActionType,UserActionInterface} from './types';

const initialState: UserState = {
	User: {
		firstname:'',
		lastname: '',
		carts:[],
		applys:[],
		resumes:[]
	},
};

export function userReducer(state = initialState, action: UserActionInterface): UserState {
	switch (action.type) {
		case UserActionType.ADD_USER:
			return { User: {
				...state.User, 
				...action.payload
			} };
		case UserActionType.ADD_RESUME:
			return { User: {
				...state.User, 
				resumes:action.payload
			} };
		case UserActionType.ADD_CART:
			const array:any = state.User.carts;
			array.push(action.payload);
			return { User: {
				...state.User, 
				carts:action.payload.carts,
				applys:action.payload.applys
			} };
		default:
			return state;
	}
}