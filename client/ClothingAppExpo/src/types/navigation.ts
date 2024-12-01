// src/types/navigation.ts

// For the authentication stack
export type AuthStackParamList = {
    Login: undefined;
    CreateUser: undefined;
    ResetPassword: { token: string };
    VerifyUser: { email: string };
    ForgotPassword: undefined;
    MainTabs: undefined; // This will hold our tab navigator
};

// For the main app tabs
export type MainTabParamList = {
    Closet: undefined;
    Stylist: undefined;
    Fits: undefined;
};