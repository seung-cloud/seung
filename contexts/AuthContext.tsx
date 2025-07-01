import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import apiClient from "../apiClient"; // 🔥 추가
import { useAuthStore } from "../stores/authStore"; // 🔥 추가

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {},
    refreshAuthState: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const refreshAuthState = useCallback(async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
            useAuthStore.setState({ isLoggedIn: true, token });
            setIsLoggedIn(true); // ✅ 이 부분을 true로 확실히 설정!
        } else {
            useAuthStore.setState({ isLoggedIn: false, token: null });
            setIsLoggedIn(false);
        }

        setLoading(false);
        console.log(
            "🔄 [AuthContext] 상태 강제 갱신됨:",
            token,
            "isLoggedIn:",
            !!token
        );
    }, []);

    useEffect(() => {
        refreshAuthState();
    }, [refreshAuthState]);

    const login = async () => {
        await AsyncStorage.setItem("userToken", "true");
        await refreshAuthState();
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userToken");
        await refreshAuthState();
    };

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, login, logout, refreshAuthState }}
        >
            {children}
        </AuthContext.Provider>
    );
};
