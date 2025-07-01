import { Theme } from "../contexts/ThemeContext";

const defaultTheme: Theme = {
    appName: "기본 컨설팅 앱",
    company_name: "company24", // ✅ 설정
    colors: {
        background: "#FFFFFF",
        primary: "#6200EE",
        accent: "#03DAC6",
        text: "#222222",
        surface: "#F6F6F6",
        error: "#B00020",
    },
    fonts: {
        main: "Roboto-Regular",
        headline: "Roboto-Bold",
        button: "Roboto-Medium",
    },
    icons: {
        main: "apps",
        consult: "chat",
    },
    logo: require("../assets/images/default_logo.png"),
    profileFields: ["이름", "이메일", "전화번호", "생년월일"],
    consultDetailsPrompt: "상담 내용을 상세히 입력해주세요.",
    extraDetailFields: [
        { name: "details", label: "상세 상담 내용", multiline: true },
    ],
};

export default defaultTheme;
