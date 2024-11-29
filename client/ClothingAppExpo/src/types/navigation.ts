// src/types/navigation_types.ts

// Define all routes in your navigation stack
export type RootStackParamList = {
    Login: undefined;
    CreateUser: undefined;
    ResetPassword: { token: string };
    VerifyUser: { email: string };
    Closet: undefined;
    ForgotPassword: undefined;
};