import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";

const devtools =
  typeof window !== "undefined" &&
  typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

const composeEnhancers = devtools || compose;

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("pricing-state");
    if (!serializedState) {
      return {};
    }

    return JSON.parse(serializedState);
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("pricing-state", serializedState);
  } catch (err) {
    console.error(err);
  }
};

const store = createStore(
  reducers,
  loadState(),
  composeEnhancers(applyMiddleware(...[thunk].concat([])))
);

export default store;
