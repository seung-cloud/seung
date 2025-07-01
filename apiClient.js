// apiClient.js 수정 (Axios 헤더 자동 추가 및 로깅 개선)
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://docker-back-rxo2.onrender.com",
    timeout: 60000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config) => {
        console.log(
            `📤 API 요청: ${config.method?.toUpperCase()} ${config.url}`
        );

        // 토큰 추가
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }


        // FormData 처리
        if (config.data instanceof FormData) {
            console.log("📤 FormData 요청 감지");
            config.headers["Content-Type"] = "multipart/form-data";

            // FormData 내용 로깅 (디버깅용)
            if (config.data._parts) {
                console.log("📤 FormData 내용:");
                config.data._parts.forEach((part, idx) => {
                    if (typeof part[1] === "object" && part[1].uri) {
                        console.log(`   ${part[0]}: [이미지 파일]`);
                    } else {
                        console.log(`   ${part[0]}: ${part[1]}`);
                    }
                });
            }
        }

        return config;
    },
    (error) => {
        console.error("📤 API 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
        console.log(`📥 API 응답: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error("📥 API 오류 응답:", error);
        if (error.response) {
            // 서버가 응답을 반환한 경우
            console.error(`   상태: ${error.response.status}`);
            console.error(`   데이터:`, error.response.data);
            console.error(`   헤더:`, error.response.headers);
        } else if (error.request) {
            // 요청은 보냈으나 응답을 받지 못한 경우
            console.error("   서버로부터 응답 없음:", error.request);
        } else {
            // 요청 설정 시 문제가 발생한 경우
            console.error("   요청 설정 오류:", error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
