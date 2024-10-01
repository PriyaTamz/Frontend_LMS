import { configureStore } from '@reduxjs/toolkit';
import userRegisterReducer from '../features/authentication/UserRegisterSlice'; 
import userLoginReducer from '../features/authentication/UserLoginSlice'; 
import AdminRegisterReducer from '../features/authentication/AdminRegisterSlice';
import AdminLoginReducer from '../features/authentication/AdminLoginSlice';
import forgotpasswordReducer from "../features/authentication/forgotpasswordSlice";
import otpReducer from "../features/authentication/enterOtpSlice";
import resetPasswordReducer from "../features/authentication/resetPasswordSlice";

const store = configureStore({
  reducer: {
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    adminRegister: AdminRegisterReducer,
    adminLogin: AdminLoginReducer,
    forgotpassword: forgotpasswordReducer,
    enterOtp: otpReducer,
    resetpassword: resetPasswordReducer,
  },
});

export default store;
