import { Theme } from "../contexts/ThemeContext";

const skinConsultTheme: Theme = {
    appName: "스킨 컨설팅 앱",
    company_name: "company21", // ✅ 설정
    colors: {
        background: "#FFF0F6",
        primary: "#FF4081",
        accent: "#FFD1DC",
        text: "#4A4A4A",
        surface: "#FFFFFF",
        error: "#B00020",
    },
    fonts: {
        main: "Roboto-Regular",
        headline: "Roboto-Bold",
        button: "Roboto-Medium",
    },
    icons: {
        main: "face",
        consult: "spa",
    },
    logo: require("../assets/images/skin_logo.png"),
    profileFields: [
        "피부 타입",
        "주요 피부 고민",
        "나이",
        "성별",
        "현재 사용하는 화장품",
    ],
    consultDetailsPrompt: "피부 관련 상담 내용을 상세히 입력해주세요.",
    extraDetailFields: [
        {
            name: "recentIssues",
            label: "최근 발생한 피부 문제",
            multiline: true,
        },
        {
            name: "allergies",
            label: "알레르기 여부 또는 특이 사항",
            multiline: true,
        },
        { name: "lifestyle", label: "생활 습관", multiline: true },
        {
            name: "selectedImage",
            label: "피부 상태 사진 첨부",
            multiline: false,
            type: "image",
        },
    ],
};

export default skinConsultTheme;
