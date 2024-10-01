import { createSlice } from "@reduxjs/toolkit";

export const AdminRegisterSlice = createSlice({
    name: "adminRegister",
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

export const { setName, setEmail, setPassword, setRole } = AdminRegisterSlice.actions;

export const selectName = state => state.adminRegister.name;
export const selectEmail = state => state.adminRegister.email;
export const selectPassword = state => state.adminRegister.password;
export const selectRole = state => state.adminRegister.role;

export default AdminRegisterSlice.reducer;