import { combineReducers } from "redux";
import authReducer from "./reducers/AccountReducer";
import cartReducer from "./reducers/CartReducer";
const rootRouter = combineReducers({
  authReducer,
  cartReducer,
});

export default rootRouter;
