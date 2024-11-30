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
    FitBuilder: undefined;
};

// Re-export RootStackParamList as a combination of both for backwards compatibility
export type RootStackParamList = AuthStackParamList;