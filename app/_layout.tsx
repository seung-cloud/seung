import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import {
    DefaultTheme as PaperDefaultTheme,
    PaperProvider,
} from "react-native-paper";
import { AuthProvider } from "../contexts/AuthContext";
import { Theme, ThemeProvider } from "../contexts/ThemeContext";
import { useAuthStore } from "../stores/authStore";

import defaultTheme from "../themes/defaultTheme";
import healthTheme from "../themes/healthTheme";
import lawTheme from "../themes/lawTheme";
import skinConsultTheme from "../themes/skinConsultTheme";

const themes: Record<string, Theme> = {
    defaultTheme,
    healthTheme,
    skinConsultTheme,
    lawTheme,
};

// expo 환경변수에서 현재 선택한 테마 이름 가져오기
const themeName =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_THEME ?? "defaultTheme";
const selectedTheme = themes[themeName] || defaultTheme;

console.log("[_layout 디버그] 선택된 테마:", themeName, selectedTheme.appName);

// Material 디자인 Paper 테마 정확히 설정
const paperTheme = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: selectedTheme.colors.primary,
        secondary:
            selectedTheme.colors.accent || PaperDefaultTheme.colors.secondary, // ✅ 'accent' 대신 'secondary'
        background: selectedTheme.colors.background,
        surface:
            selectedTheme.colors.surface || PaperDefaultTheme.colors.surface,
        text: selectedTheme.colors.text,
        error: selectedTheme.colors.error || PaperDefaultTheme.colors.error,
    },
};

export default function RootLayout() {
    const initialize = useAuthStore((state) => state.initialize);
    useEffect(() => {
        initialize();
    }, []);

    return (
        <ThemeProvider theme={selectedTheme}>
            <AuthProvider>
                <PaperProvider theme={paperTheme}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="consult"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="profile"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="settings"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="+not-found"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="extraDetails"
                            options={{ headerShown: false }}
                        />{" "}
                        {/* 🔥 추가 필수 */}
                    </Stack>
                </PaperProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
