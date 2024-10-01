import { createSlice } from "@reduxjs/toolkit";

export const UserRegisterSlice = createSlice({
    name: "userRegister",
    initialState: {
        name: "",
        email: "",
        password: "",
        role: "",
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        }
    }
});

export const { setName, setEmail, setPassword, setRole } = UserRegisterSlice.actions;

export const selectName = state => state.userRegister.name;
export const selectEmail = state => state.userRegister.email;
export const selectPassword = state => state.userRegister.password;
export const selectRole = state => state.userRegister.role;

export default UserRegisterSlice.reducer;