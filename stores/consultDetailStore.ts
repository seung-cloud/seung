import { create } from "zustand";
import apiClient from "../apiClient";

interface ConsultDetailsState {
    details: Record<string, any>;
    loadDetails: (theme: string) => Promise<void>;
    saveDetails: (theme: string, formData: FormData) => Promise<void>;
}

export const useConsultDetailStore = create<ConsultDetailsState>((set) => ({
    details: {},

    loadDetails: async (theme: string) => {
        try {
            console.log(`상담 상세정보 로드 시작 - 테마: ${theme}`);
            const response = await apiClient.get("/user/consult-details", {
                params: { theme },
            });

            console.log("상담 상세정보 응답:", response.data);

            if (response.data.status === "success") {
                set({ details: response.data.details });
                console.log("상담 상세정보 로드 성공");
            } else {
                console.log("상담 상세정보 없음");
                set({ details: {} });
            }
        } catch (error) {
            console.error("상담 상세정보 로드 실패:", error);
            throw error;
        }
    },

    saveDetails: async (theme: string, formData: FormData) => {
        try {
            console.log(`상담 상세정보 저장 시작 - 테마: ${theme}`);

            // formData가 이미 theme을 포함하고 있는지 확인
            let hasTheme = false;
            for (const [key] of (formData as any).entries()) {
                if (key === "theme") {
                    hasTheme = true;
                    break;
                }
            }

            // theme이 없으면 추가
            if (!hasTheme) {
                formData.append("theme", theme);
            }

            const response = await apiClient.post(
                "/user/consult-details",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                    transformRequest: (data) => {
                        return data; // axios 기본 변환 방지
                    },
                }
            );

            console.log("상담 상세정보 저장 응답:", response.data);

            if (response.data.status !== "success") {
                throw new Error(response.data.message || "상담 정보 저장 실패");
            }

            // 이미지 URI는 제외하고 텍스트 데이터만 저장
            const textDetails: Record<string, any> = {};
            for (const [key, value] of (formData as any).entries()) {
                // 이미지가 아닌 경우(값이 문자열인 경우)만 저장
                if (typeof value === "string") {
                    textDetails[key] = value;
                }
            }

            // 이미지 URI는 서버에서 받은 URL로 대체
            if (response.data.imageUrl) {
                // 이미지 필드 찾기
                const imageFieldName = Object.keys(response.data.details).find(
                    (key) =>
                        response.data.details[key] === response.data.imageUrl
                );

                if (imageFieldName) {
                    textDetails[imageFieldName] = response.data.imageUrl;
                }
            }

            set({ details: { ...textDetails, ...response.data.details } });
            console.log("상담 상세정보 저장 및 상태 업데이트 완료");
        } catch (error) {
            console.error("상담 상세정보 저장 실패:", error);
            throw error;
        }
    },
}));
