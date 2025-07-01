import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuthStore } from "../../stores/authStore";

export default function AuthLoadingScreen() {
    const router = useRouter();
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        const checkAuth = async () => {
            await initialize(); // 명확히 상태 초기화

            if (useAuthStore.getState().isLoggedIn) {
                router.replace("/");
            } else {
                router.replace("/auth/login");
            }
        };
        checkAuth();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
