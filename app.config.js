import "dotenv/config";

export default {
    expo: {
        name: "SkinExpert",
        slug: "frontend_F", // ✅ 기존 slug로 원상복구
        version: "1.0.0",
        orientation: "portrait",
        scheme: "skinexpert",
        userInterfaceStyle: "automatic",
        icon: "./assets/images/icon.png",
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        android: {
            package: "com.frontendf.app",
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            softwareKeyboardLayoutMode: "pan",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.frontendf.app",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
            "expo-font",
        ],
        experiments: {
            typedRoutes: true,
            newArchEnabled: true,
        },
        extra: {
            eas: {
                projectId: "5992fc05-f003-44e3-a9f6-25bae7be06fe",
            },
            EXPO_PUBLIC_APP_THEME:
                process.env.EXPO_PUBLIC_APP_THEME || "defaultTheme",
        },
    },
};
