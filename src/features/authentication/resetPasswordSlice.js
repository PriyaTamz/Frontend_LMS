import { createSlice } from "@reduxjs/toolkit";

export const resetpasswordSlice = createSlice({
    name: "resetpassword",
    initialState: {
        token: "",
        newPassword: "",
        confirmPassword: ""
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setNewPassword: (state, action) => {
            state.newPassword = action.payload;
        },
        setConfirmPassword: (state, action) => {
            state.confirmPassword = action.payload;
        }
    }
});

export const { setToken, setNewPassword, setConfirmPassword } = resetpasswordSlice.actions;

export const selectToken = (state) => state.resetpassword.token;
export const selectNewPassword = (state) => state.resetpassword.newPassword;
export const selectConfirmPassword = (state) => state.resetpassword.confirmPassword;

export default resetpasswordSlice.reducer;
