import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

// ---- 카카오, 네이버 키/상수 ----
const KAKAO_REST_API_KEY = "971cf7c87284261f9d101570f8704a98";
const NAVER_CLIENT_ID = "WLdgbWVEISBQ2m2g1mef";
const NAVER_STATE = "RANDOM_STATE_ABC123"; // 아무 임의 문자열
const REDIRECT_URI = AuthSession.makeRedirectUri();
const isWeb = typeof window !== "undefined" && !!window.document;

export default function MainScreen() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    // ---- 구글 로그인 세팅 (clientId만 써야 오류 없음) ----
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "322193414072-3fscogj4f7b0d5dpj2ns04a94afn8f91.apps.googleusercontent.com",
    });

    // ---- 구글 로그인 응답 핸들러 ----
    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            alert("구글 로그인 성공!\n\n" + JSON.stringify(authentication));
            setShowLoginModal(false);
            // TODO: 사용자 정보, 토큰 처리 등 추가 구현
        }
    }, [response]);

    // ---- 카카오/네이버 팝업 콜백 리스너 (웹만) ----
    React.useEffect(() => {
        // 새 창(팝업)에서 code를 window.postMessage로 보낼 때 받음
        const handler = (event: any) => {
            if (event.data && event.data.code) {
                if (event.data.provider === "naver") {
                    alert("네이버 로그인 성공!\ncode: " + event.data.code);
                    setShowLoginModal(false);
                }
                if (event.data.provider === "kakao") {
                    alert("카카오 로그인 성공!\ncode: " + event.data.code);
                    setShowLoginModal(false);
                }
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    // ---- 카카오 로그인 ----
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    const handleKakaoLogin = async () => {
        if (isWeb) {
            // 웹에서는 팝업 새창으로
            window.open(kakaoAuthUrl, "_blank", "width=500,height=700");
        } else {
            // 앱(Expo Go 등)에서는 startAsync만 동작
            const result = await (AuthSession as any).startAsync({ authUrl: kakaoAuthUrl });
            if (result.type === "success") {
                alert("카카오 로그인 성공!\ncode: " + result.params.code);
                setShowLoginModal(false);
            }
        }
    };

    // ---- 네이버 로그인 ----
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${NAVER_STATE}`;
    const handleNaverLogin = async () => {
        if (isWeb) {
            window.open(naverAuthUrl, "_blank", "width=500,height=700");
        } else {
            const result = await (AuthSession as any).startAsync({ authUrl: naverAuthUrl });
            if (result.type === "success") {
                alert("네이버 로그인 성공!\ncode: " + result.params.code);
                setShowLoginModal(false);
            }
        }
    };

    // ---- 로그인 버튼 ----
    const handleLogin = () => setShowLoginModal(true);

    return (
        <>
            {/* 소셜 로그인 모달 */}
            {showLoginModal && (
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>간편 로그인</Text>
                        <TouchableOpacity
                            style={[styles.socialBtn, { backgroundColor: "#FEE500" }]}
                            onPress={handleKakaoLogin}
                        >
                            <Text style={[styles.socialBtnText, { color: "#181600" }]}>카카오로 로그인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.socialBtn, { backgroundColor: "#03C75A" }]}
                            onPress={handleNaverLogin}
                        >
                            <Text style={[styles.socialBtnText, { color: "#fff" }]}>네이버로 로그인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.socialBtn, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#4285F4" }]}
                            onPress={() => promptAsync()}
                        >
                            <Text style={[styles.socialBtnText, { color: "#4285F4" }]}>구글로 로그인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowLoginModal(false)} style={{ marginTop: 18, alignSelf: "center" }}>
                            <Text style={{ color: "#999", fontSize: 15 }}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={styles.bg}>
                {/* 상단 오른쪽 로그인 버튼 */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginBtnText}>로그인</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.center}>
                    {/* 기존 UI 내용 */}
                    <Image
                        source={require("../../assets/images/skin_logo.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.slogan}>나만의 피부진단</Text>
                    <Text style={styles.subtitle}>지금 바로 시작해보세요!</Text>
                    <TouchableOpacity style={styles.mainButton}>
                        <Text style={styles.mainButtonText}>피부 분석 시작하기</Text>
                    </TouchableOpacity>
                    <View style={styles.subButtons}>
                        <TouchableOpacity style={styles.subButton}>
                            <Text style={styles.subButtonText}>내 프로필</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.subButton}>
                            <Text style={styles.subButtonText}>상세 상담 입력</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

// ---- 스타일 ----
const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: "#eaf9fc",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 36,
        right: 0,
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 24,
        zIndex: 10,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    loginBtn: {
        backgroundColor: "#16b0c8",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 24,
        elevation: 2,
    },
    loginBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 90,
        marginBottom: 22,
        marginTop: 10,
    },
    slogan: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#16b0c8",
        marginBottom: 4,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 22,
        color: "#72a9c3",
        marginBottom: 30,
        textAlign: "center",
        fontWeight: "600",
    },
    mainButton: {
        backgroundColor: "#16b0c8",
        borderRadius: 20,
        width: "88%",
        alignItems: "center",
        paddingVertical: 18,
        marginVertical: 10,
        elevation: 6,
    },
    mainButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    subButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "88%",
        marginTop: 6,
    },
    subButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: "#f7fafc",
        borderRadius: 16,
        paddingVertical: 13,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#c3e8ef",
    },
    subButtonText: {
        color: "#16b0c8",
        fontWeight: "600",
    },
    modalBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.15)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    modalBox: {
        width: 290,
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 18,
        alignItems: "stretch",
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#16b0c8",
        textAlign: "center",
    },
    socialBtn: {
        borderRadius: 10,
        paddingVertical: 14,
        marginBottom: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    socialBtnText: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
