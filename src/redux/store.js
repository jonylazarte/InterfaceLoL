import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import pokemonReducer from './slices/userPokemonSlice';
import skinsReducer from './slices/userSkinsSlice';
import interfaceReducer from './slices/userInterfaceSlice';
import authReducer from './slices/authSlice';

/*import navigationReducer from './slices/navigationSlice';*/
import connectedUsersReducer from './slices/connectedUsersSlice';
import chatReducer from './slices/chatSlice';
import profileReducer from './slices/profileSlice';
import storeReducer from './slices/storeSlice';
import matchmakingReducer from './slices/matchmakingSlice';
import notificationsReducer from './slices/notificationsSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    userChampions: pokemonReducer,
    userSkins: skinsReducer,
    userInterface: interfaceReducer,
    auth: authReducer,

    connectedUsers: connectedUsersReducer,
    chat: chatReducer,
    profile: profileReducer,
    storeData: storeReducer, // 'store' es palabra reservada, cambio nombre aquí
    matchmaking: matchmakingReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
  },
});

export default store;