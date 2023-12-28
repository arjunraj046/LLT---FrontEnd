import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface User {
  _id: string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  userRole: number;
}

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;
export const user = (state: RootState) => state.user.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const userReducer = userSlice.reducer;