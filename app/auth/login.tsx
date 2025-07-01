// auth/login.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import apiClient from "../../apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../stores/authStore";

export default function LoginScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { login, refreshAuthState } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginZustand = useAuthStore((state) => state.login);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });

            if (response.status === 200 && response.data.token) {
                const token = response.data.token;

                // AsyncStorage에 JWT 토큰 저장 (필수!)
                await AsyncStorage.setItem("userToken", token);

                // Zustand 상태관리에도 저장
                useAuthStore.setState({ token, isLoggedIn: true });

                // API클라이언트 헤더에 토큰 설정 (필수!)
                apiClient.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                // 상태 갱신
                await refreshAuthState();

                router.replace("/auth/AuthLoading");
            } else {
                throw new Error("로그인 실패");
            }
        } catch (error) {
            Alert.alert("오류", "로그인 실패");
        }
    };
    
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <Image source={theme.logo} style={styles.logo} />

            <Text style={[styles.title, { color: theme.colors.primary }]}>
                {theme.appName} 로그인
            </Text>

            <TextInput
                label="이메일"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                label="비밀번호"
                mode="outlined"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <Button
                mode="contained"
                style={styles.button}
                onPress={handleLogin}
            >
                로그인
            </Button>

            <Button mode="text" onPress={() => router.push("/auth/register")}>
                회원가입
            </Button>

            <View style={styles.oauthContainer}>
                <Button
                    mode="outlined"
                    icon="google"
                    style={styles.oauthButton}
                >
                    Google
                </Button>
                <Button mode="outlined" icon="chat" style={styles.oauthButton}>
                    KakaoTalk
                </Button>
                <Button mode="outlined" icon="web" style={styles.oauthButton}>
                    Naver
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        padding: 5,
    },
    oauthContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    oauthButton: {
        flex: 1,
        marginHorizontal: 5,
    },
});
