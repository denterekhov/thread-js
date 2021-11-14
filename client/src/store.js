import {
    createStore,
    applyMiddleware,
    combineReducers
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import threadReducer from './containers/Thread/reducer.js';
import profileReducer from './containers/Profile/reducer.js';

export const history = createBrowserHistory();

const initialState = {};

const middlewares = [
    thunk,
    routerMiddleware(history)
];

const composedEnhancers = composeWithDevTools(
    applyMiddleware(...middlewares)
);

const reducers = {
    posts: threadReducer,
    profile: profileReducer,
};

const rootReducer = combineReducers({
    router: connectRouter(history),
    ...reducers
});

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

export default store;
