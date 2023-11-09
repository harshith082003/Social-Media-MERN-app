import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/User';

const initialState = {}
const store = configureStore({
    reducer: {userReducer}
});

export default store;