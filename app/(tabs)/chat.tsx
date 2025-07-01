import { Stack } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import apiClient from "../../apiClient";

export default function ChatScreen() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");

    const sendMessage = async () => {
        try {
            const response = await apiClient.post(
                "/chatbot/message?company_name=companyA",
                {
                    message,
                    user_key: "test_user_001",
                }
            );
            setReply(response.data.reply);
        } catch (error) {
            setReply("메시지 전송 실패");
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <Text style={styles.title}>AI 채팅 화면</Text>
                <TextInput
                    style={styles.input}
                    placeholder="메시지를 입력하세요"
                    value={message}
                    onChangeText={setMessage}
                />
                <Button title="전송" onPress={sendMessage} />
                <Text style={styles.reply}>{reply}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    reply: { marginTop: 20, fontSize: 16 },
});
