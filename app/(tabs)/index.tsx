import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../stores/authStore";

export default function MainScreen() {
    const theme = useTheme();
    const router = useRouter();
    const initialize = useAuthStore((state) => state.initialize);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const logout = useAuthStore((state) => state.logout);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useFocusEffect(
        useCallback(() => {
            initialize();
        }, [])
    );

    const handlePress = useCallback(
        (route: string) => {
            if (!isLoggedIn) {
                setSnackbarMessage(
                    "로그인이 필요합니다. 로그인 후 이용해주세요."
                );
                setSnackbarVisible(true);
                router.push("/auth/login");
                return;
            }
            router.push(route as any);
        },
        [isLoggedIn, router]
    );

    const handleLogout = async () => {
        await logout();
        setSnackbarMessage("성공적으로 로그아웃 되었습니다.");
        setSnackbarVisible(true);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <Image source={theme.logo} style={styles.logo} />
                <Text style={[styles.appName, { color: theme.colors.primary }]}>
                    {theme.appName}
                </Text>

                <Button
                    mode="contained"
                    onPress={() => handlePress("/profile")}
                    style={styles.button}
                >
                    내 프로필
                </Button>

                <Button
                    mode="contained"
                    onPress={() => handlePress("/consult/extraDetails")}
                    style={styles.button}
                >
                    상세 상담 정보 입력
                </Button>

                <Button
                    mode="contained"
                    onPress={() => handlePress("/consult/details")}
                    style={styles.button}
                >
                    컨설팅 시작
                </Button>

                {isLoggedIn ? (
                    <Button onPress={handleLogout}>로그아웃</Button>
                ) : (
                    <Button onPress={() => router.push("/auth/login")}>
                        로그인
                    </Button>
                )}

                <Button
                    compact
                    mode="text"
                    onPress={() => router.push("/settings/language")}
                    style={styles.languageButton}
                >
                    🌐 언어 설정
                </Button>
            </View>

            {/* ✅ Snackbar는 반드시 JSX 내부에 렌더링 */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{ backgroundColor: theme.colors.primary }}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 15,
    },
    appName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    button: {
        width: "100%",
        marginVertical: 6,
        paddingVertical: 5,
    },
    languageButton: {
        position: "absolute",
        top: 50,
        right: 20,
    },
});
