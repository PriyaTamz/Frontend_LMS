import { createSlice } from "@reduxjs/toolkit";

export const UserLoginSlice = createSlice({
    name: "userLogin",
    initialState: {
        email: "",
        password: ""
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        }
    }
});

export const { setEmail, setPassword } = UserLoginSlice.actions;

export const selectEmail = state => state.userLogin.email;
export const selectPassword = state => state.userLogin.password;

export default UserLoginSlice.reducer;