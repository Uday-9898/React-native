//import { combinedReducers } from "./mainReducer";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { mainSaga } from "./mainSaga";
import { combineReducers } from "redux";

import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * You can import more reducers here
 */

//@BlueprintReduxImportInsertion
import CalendarReducer from '../features/Calendar/redux/reducers';
import EmailAuthReducer from '../features/EmailAuth/redux/reducers';
import ClockInOutReducer from '../features/HomeAgendaDay/redux/reducers';



const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
 key: 'root',
 storage: AsyncStorage,
 whitelist: ['eventsOffline']
}
const persistedReducer = persistReducer(persistConfig, ClockInOutReducer)

const combinedReducers = combineReducers({
  blank: (state, action) => {
    if (state == null) state = [];
    return state;
  },
  //@BlueprintReduxCombineInsertion
Calendar: CalendarReducer,
EmailAuth: EmailAuthReducer,
Offline: persistedReducer,

});

/**
 * this app uses React Native Debugger, but it works without it
 */

 

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [sagaMiddleware /** more middlewares if any goes here */];

const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(...middlewares)),
);

const persistor = persistStore(store)

sagaMiddleware.run(mainSaga);


export { store, persistor };