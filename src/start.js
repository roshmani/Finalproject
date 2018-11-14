import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
/**********************************Redux headers*****************************/
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
/*****************************socket******************************************/
import { getSocket } from "./socket";

/*****************************************************************************/
let elem;
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (getSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

ReactDOM.render(elem, document.querySelector("main"));
