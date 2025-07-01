import { Theme } from "../contexts/ThemeContext";

const healthTheme: Theme = {
    appName: "헬스케어 컨설팅 앱",
    company_name: "company22", // ✅ 설정
    colors: {
        background: "#E8F5E9", // 연한 그린 배경 (건강 이미지)
        primary: "#3F51B5", // Material 블루
        accent: "#00BCD4", // 밝은 청록색
        text: "#333333", // 기본 텍스트 색상
        surface: "#FFFFFF", // 표면 배경색
        error: "#B00020", // Material 오류 색상
    },
    fonts: {
        main: "Roboto-Regular",
        headline: "Roboto-Bold",
        button: "Roboto-Medium",
    },
    icons: {
        main: "favorite", // 건강과 관련된 하트 아이콘
        consult: "medical-services",
    },
    logo: require("../assets/images/health_logo.png"),
    profileFields: ["키", "몸무게", "연령대", "운동 습관", "식습관"],
    consultDetailsPrompt: "건강 상담 정보를 상세히 입력해주세요.",
    extraDetailFields: [
        { name: "recentIssues", label: "최근 건강 문제", multiline: true },
        { name: "medications", label: "복용 중인 약", multiline: true },
        { name: "allergies", label: "알레르기", multiline: true },
        { name: "lifestyle", label: "생활 습관", multiline: true },
    ],
};

export default healthTheme;
