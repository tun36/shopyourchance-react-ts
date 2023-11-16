import { createStore, combineReducers,applyMiddleware } from "redux";
//import logger from 'redux-logger';
import { userReducer } from "./reducers";

const rootReducer = combineReducers({
	userReducer,
});
function logger({ getState } : any) {
	return (next: any) => (action: any) => {
	  console.log('will dispatch', action)
  
	  // Call the next dispatch method in the middleware chain.
	  const returnValue = next(action)
  
	  console.log('state after dispatch', getState())
  
	  // This will likely be the action itself, unless
	  // a middleware further in chain changed it.
	  return returnValue
	}
}
const middlewares = [logger];
export type RootState = ReturnType<typeof rootReducer>;
export default function configureStore() {
	const store = createStore(rootReducer,applyMiddleware(logger));

	return store;
}