// auth/register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import apiClient from "../../apiClient";
import { useTheme } from "../../contexts/ThemeContext";

export default function RegisterScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert("오류", "유효한 이메일 주소를 입력해 주세요.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await apiClient.post("/auth/register", {
                email,
                password,
            });
            console.log("✅ 회원가입 성공 응답:", response.data);

            Alert.alert("성공", "회원가입이 완료되었습니다.", [
                { text: "확인", onPress: () => router.push("/auth/login") },
            ]);
        } catch (error) {
            if (
                error instanceof Error &&
                "response" in error &&
                error.response
            ) {
                const axiosError = error as any;
                console.error(
                    "🚨 회원가입 응답 오류 데이터:",
                    axiosError.response.data
                );
                Alert.alert(
                    "회원가입 실패",
                    axiosError.response.data.detail ||
                        "이미 존재하는 이메일입니다."
                );
            } else {
                console.error("회원가입 요청 중 오류 발생:", error);
                Alert.alert("회원가입 실패", "서버에 연결할 수 없습니다.");
            }
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
                {theme.appName} 회원가입
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
            <TextInput
                label="비밀번호 확인"
                mode="outlined"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <Button
                mode="contained"
                style={styles.button}
                onPress={handleRegister}
            >
                회원가입
            </Button>

            <Button mode="text" onPress={() => router.push("/auth/login")}>
                이미 계정이 있으신가요? 로그인
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
