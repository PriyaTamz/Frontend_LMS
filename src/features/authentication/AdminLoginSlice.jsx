import { createSlice } from "@reduxjs/toolkit";

export const AdminLoginSlice = createSlice({
    name: "adminLogin",
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

export const { setEmail, setPassword } = AdminLoginSlice.actions;

export const selectEmail = state => state.adminLogin.email;
export const selectPassword = state => state.adminLogin.password;

export default AdminLoginSlice.reducer;