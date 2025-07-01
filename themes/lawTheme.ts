import { Theme } from "../contexts/ThemeContext";

const lawTheme: Theme = {
    appName: "법률 상담 앱",
    company_name: "company23", // ✅ 설정
    colors: {
        background: "#E8F0FE", // 밝은 블루톤 배경
        primary: "#0D47A1", // Material 진한 블루
        accent: "#FFC107", // Material 노란색 (강조)
        text: "#212121", // 진한 회색 텍스트
        surface: "#FFFFFF", // 표면 배경색
        error: "#B00020", // Material 오류 색상
    },
    fonts: {
        main: "Roboto-Regular",
        headline: "Roboto-Bold",
        button: "Roboto-Medium",
    },
    icons: {
        main: "gavel", // 법률 관련 아이콘 (망치)
        consult: "balance", // 저울 아이콘 (법의 균형 상징)
    },
    logo: require("../assets/images/law_logo.png"),
    profileFields: ["이름", "이메일", "전화번호", "상담 분야"],
    consultDetailsPrompt: "상담할 법률 관련 내용을 상세히 입력해주세요.",
    extraDetailFields: [
        { name: "caseDetails", label: "사건의 상세 내용", multiline: true },
        {
            name: "relevantDocs",
            label: "관련 문서 첨부",
            multiline: false,
            type: "image",
        },
    ],
};

export default lawTheme;
