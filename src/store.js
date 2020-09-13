import thunk from 'redux-thunk';
import { dataListReducer } from './reducers/dataReducers';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';

const initialState = {};
const reducer = combineReducers({
    dataList : dataListReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;