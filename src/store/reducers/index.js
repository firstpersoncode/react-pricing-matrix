import { combineReducers } from "redux";
import suppliers from "./suppliers";
import activities from "./activities";
import rooms from "./rooms";
import seasons from "./seasons";
import matrix from "./matrix";
import details from "./details";

export default combineReducers({
  suppliers,
  activities,
  rooms,
  seasons,
  matrix,
  details
});
