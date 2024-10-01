import { createSlice } from "@reduxjs/toolkit";

export const forgotpasswordSlice = createSlice({
    name: "forgotpassword",
    initialState: {
        email: ""
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        }
    }
});

export const { setEmail } = forgotpasswordSlice.actions;

export const selectEmail = state => state.forgotpassword.email;

export default forgotpasswordSlice.reducer;
 

 