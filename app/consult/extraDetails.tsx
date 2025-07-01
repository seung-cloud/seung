import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import apiClient from "../../apiClient";
import { useTheme } from "../../contexts/ThemeContext";
import { useConsultDetailStore } from "../../stores/consultDetailStore";

export default function ExtraDetailsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { loadDetails } = useConsultDetailStore();
    const [localDetails, setLocalDetails] = useState<
        Record<string, string | null>
    >({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const fetchDetails = async () => {
                setIsLoading(true);
                try {
                    await loadDetails(theme.appName);
                    const loadedDetails =
                        useConsultDetailStore.getState().details;
                    setLocalDetails(loadedDetails);
                } catch (error) {
                    Alert.alert(
                        "알림",
                        "상담 정보를 로딩하는 중 문제가 발생했습니다."
                    );
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetails();
        }, [loadDetails, theme.appName])
    );

    const pickImage = async (fieldName: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setLocalDetails((prev) => ({
                ...prev,
                [fieldName]: result.assets[0].uri,
            }));
        }
    };

    const handleSaveDetails = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("theme", theme.appName);

            for (const field of theme.extraDetailFields) {
                if (field.type === "image" && localDetails[field.name]) {
                    const uri = localDetails[field.name] as string;
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    const fileName = uri.split("/").pop();
                    const match = /\.(\w+)$/.exec(fileName || "");
                    const fileType = match ? `image/${match[1]}` : "image/jpeg";

                    formData.append(field.name, blob, fileName); // 반드시 이렇게 전달해야 서버에서 인식 가능!
                } else if (field.type !== "image") {
                    formData.append(field.name, localDetails[field.name] || "");
                }
            }

            const response = await apiClient.post(
                "/user/consult-details",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    transformRequest: (data) => data,
                }
            );

            if (response.data.status === "success") {
                Alert.alert("성공", "상담 정보가 저장되었습니다.");
                router.push("/");
            } else {
                throw new Error("서버 저장 실패");
            }
        } catch (error) {
            console.error("🚨 저장 오류:", error);
            Alert.alert("저장 오류", `저장 중 문제가 발생했습니다: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>상세 상담정보 로딩 중...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <Text style={[styles.header, { color: theme.colors.text }]}>
                상세 상담정보 입력
            </Text>
            {theme.extraDetailFields.map((field) => (
                <View key={field.name} style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        {field.label}
                    </Text>
                    {field.type === "image" ? (
                        <>
                            <Button
                                mode="outlined"
                                onPress={() => pickImage(field.name)}
                                disabled={isSaving}
                            >
                                사진 첨부하기
                            </Button>
                            {localDetails[field.name] && (
                                <Image
                                    source={{
                                        uri: localDetails[field.name] as string,
                                    }}
                                    style={styles.previewImage}
                                />
                            )}
                        </>
                    ) : (
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: theme.colors.text,
                                    backgroundColor: theme.colors.surface,
                                },
                                field.multiline ? { height: 100 } : {},
                            ]}
                            placeholder={`${field.label} 입력`}
                            multiline={field.multiline}
                            placeholderTextColor={theme.colors.text}
                            value={localDetails[field.name] || ""}
                            onChangeText={(text) =>
                                setLocalDetails((prev) => ({
                                    ...prev,
                                    [field.name]: text,
                                }))
                            }
                            editable={!isSaving}
                        />
                    )}
                </View>
            ))}
            <Button
                mode="contained"
                onPress={handleSaveDetails}
                loading={isSaving}
                disabled={isSaving}
            >
                {isSaving ? "저장 중..." : "저장"}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        padding: 10,
    },
    previewImage: { width: "100%", height: 250, marginTop: 15 },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
