import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display"; // ✅ 추가된 부분
import apiClient from "../../apiClient";
import { useTheme } from "../../contexts/ThemeContext";

export default function ConsultStartScreen() {
    const { details } = useLocalSearchParams();
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);
    const [followUpQuestion, setFollowUpQuestion] = useState("");
    const theme = useTheme();

    const sendConsultRequest = async (message: string) => {
        setLoading(true);
        try {
            const res = await apiClient.post(
                `/chatbot/message?company_name=${theme.company_name}`, // ✅ 테마에서 동적으로 설정
                {
                    message,
                    user_key: "test_user_001",
                }
            );

            if (
                res.status === 200 &&
                res.data &&
                typeof res.data.reply === "string"
            ) {
                setResponse(res.data.reply);
            } else {
                console.error("응답 데이터에 reply 필드가 없습니다:", res.data);
                setResponse("상담 응답 구조에 문제가 있습니다.");
            }
        } catch (error) {
            console.error("API 요청 중 에러 발생:", error);
            setResponse("상담에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof details === "string") {
            sendConsultRequest(details);
        } else if (Array.isArray(details)) {
            sendConsultRequest(details.join(" "));
        }
    }, [details]);

    const handleFollowUp = () => {
        if (followUpQuestion.trim()) {
            sendConsultRequest(followUpQuestion);
            setFollowUpQuestion("");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <Text style={[styles.title, { color: theme.colors.text }]}>
                피부 AI 컨설팅
            </Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                    <Text style={styles.loadingText}>
                        분석 중입니다. 잠시만 기다려주세요...
                    </Text>
                </View>
            ) : (
                <Markdown
                    style={{
                        body: styles.response,
                        link: { color: theme.colors.primary },
                    }}
                    onLinkPress={(url) => {
                        Linking.openURL(url);
                        return true; // ✅ 반드시 boolean 반환 필요
                    }}
                >
                    {response}
                </Markdown>
            )}

            <View style={styles.followUpContainer}>
                <TextInput
                    style={styles.followUpInput}
                    placeholder="추가적으로 궁금한 점이 있으면 입력해주세요."
                    multiline
                    value={followUpQuestion}
                    onChangeText={setFollowUpQuestion}
                />
                <Button
                    title="추가 질문하기"
                    color={theme.colors.primary}
                    onPress={handleFollowUp}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    response: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
    followUpContainer: {
        marginTop: 20,
    },
    followUpInput: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        height: 120,
        textAlignVertical: "top",
        marginBottom: 10,
    },

    // ✅ 추가할 스타일
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    },
});
