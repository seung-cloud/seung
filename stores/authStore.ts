import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoggedIn: false,

    login: async (token: string) => {
        await AsyncStorage.setItem("userToken", token);
        set({ token, isLoggedIn: true });
    },

    logout: async () => {
        await AsyncStorage.removeItem("userToken");
        set({ token: null, isLoggedIn: false });
    },

    initialize: async () => {
        const token = await AsyncStorage.getItem("userToken");
        set({ token, isLoggedIn: !!token });
    },
}));
