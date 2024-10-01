import { createSlice } from "@reduxjs/toolkit";

export const otpSlice = createSlice({
    name: "enterOtp",
    initialState: {
        otp: ""
    },
    reducers: {
        setOtp: (state, action) => {
            state.otp = action.payload;
        }
    }
});

export const { setOtp } = otpSlice.actions;

export const selectOtp = state => state.enterOtp.otp;

export default otpSlice.reducer;
