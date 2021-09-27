import { combineReducers } from "redux";
import tasks from "./tasks";
import errors from "./errors";
import auth from "./auth";

export default combineReducers({
    tasks,
    errors,
    auth
});