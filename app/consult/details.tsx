import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function ConsultDetailsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [consultDetails, setConsultDetails] = useState("");

    const startConsulting = () => {
        const combinedDetails = `저는 ${consultDetails}`;
        router.push({
            pathname: "/consult/start",
            params: { details: combinedDetails },
        });
    };

    useEffect(() => {
        setConsultDetails("");
    }, [theme]);

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <Text style={[styles.header, { color: theme.colors.text }]}>
                {theme.consultDetailsPrompt}
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.prefixText}>저는</Text>
                <TextInput
                    style={styles.input}
                    placeholder="내용을 상세하게 입력해 주세요."
                    multiline
                    numberOfLines={20}
                    value={consultDetails}
                    onChangeText={setConsultDetails}
                />
            </View>

            <Button
                title="컨설팅 시작"
                color={theme.colors.primary}
                onPress={startConsulting}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center", // 세로 중앙정렬
        padding: 20,
    },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center", // ✅ 추가된 가로 중앙 정렬 옵션
        marginBottom: 20,
    },
    prefixText: {
        fontSize: 16,
        marginRight: 5,
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        height: 300,
        textAlignVertical: "top",
    },
});
