import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeContext";
import { useProfileStore } from "../../stores/profileStore";

export default function ProfileScreen() {
    const theme = useTheme();
    const router = useRouter();
    const {
        profile,
        loadProfile,
        saveProfile,
        saveProfileLocally,
        syncWithServer,
    } = useProfileStore();
    const [localProfile, setLocalProfile] = useState(profile);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSnackVisible, setSyncSnackVisible] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");
    const [saveStatus, setSaveStatus] = useState<{
        success: boolean;
        message: string;
        isLocal: boolean;
    } | null>(null);

    // 화면 진입 시 프로필 로딩을 정확히 수행
    useFocusEffect(
        React.useCallback(() => {
            const fetchProfile = async () => {
                setIsLoading(true);
                try {
                    await loadProfile(theme.appName);
                    setLocalProfile(useProfileStore.getState().profile); // 상태를 직접 Zustand에서 가져와 강제 업데이트
                } catch (error) {
                    Alert.alert(
                        "알림",
                        "프로필 정보가 아직 없습니다. 새로 입력해주세요."
                    );
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfile();
        }, [loadProfile, theme.appName])
    );

    // Zustand 상태가 변경될 때 localProfile 업데이트
    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveStatus(null);

        try {
            // 서버 저장 시도
            await saveProfile(theme.appName, localProfile);
            setSaveStatus({
                success: true,
                message: "프로필 저장이 완료되었습니다.",
                isLocal: false,
            });

            // 3초 후 홈으로 이동
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            // 서버 저장 실패 - 이미 내부적으로 로컬 저장은 시도했음
            console.error("프로필 저장 중 오류 발생", error);

            // 사용자에게 로컬에만 저장되었음을 알림
            setSaveStatus({
                success: true,
                message:
                    "서버 연결 오류로 로컬에만 저장되었습니다. 동기화 버튼을 눌러 서버와 동기화해주세요.",
                isLocal: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // 서버와 동기화 시도
    const handleSyncWithServer = async () => {
        setIsSyncing(true);
        try {
            const success = await syncWithServer(theme.appName);
            if (success) {
                setSyncMessage("서버와 프로필 동기화 성공!");
            } else {
                setSyncMessage("서버 동기화 실패. 다시 시도해주세요.");
            }
            setSyncSnackVisible(true);
        } catch (error) {
            console.error("동기화 중 오류 발생:", error);
            setSyncMessage("동기화 중 오류가 발생했습니다.");
            setSyncSnackVisible(true);
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 10 }}>프로필 로딩 중...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.headerText,
                            { color: theme.colors.text },
                        ]}
                    >
                        내 프로필 관리
                    </Text>
                    <Button
                        mode="outlined"
                        onPress={handleSyncWithServer}
                        loading={isSyncing}
                        disabled={isSyncing || isSaving}
                        compact
                    >
                        서버 동기화
                    </Button>
                </View>

                {saveStatus && (
                    <View
                        style={[
                            styles.statusMessage,
                            {
                                backgroundColor: saveStatus.isLocal
                                    ? "#FFF3CD"
                                    : "#D1E7DD",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: saveStatus.isLocal
                                    ? "#856404"
                                    : "#0f5132",
                                textAlign: "center",
                            }}
                        >
                            {saveStatus.message}
                        </Text>
                    </View>
                )}

                {theme.profileFields.map((field, index) => (
                    <View key={index} style={styles.inputGroup}>
                        <Text style={styles.label}>{field}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                field.includes("화장품") ? { height: 100 } : {},
                            ]}
                            placeholder={`${field} 입력`}
                            multiline={field.includes("화장품")}
                            value={localProfile[field] || ""}
                            onChangeText={(text) =>
                                setLocalProfile({
                                    ...localProfile,
                                    [field]: text,
                                })
                            }
                        />
                    </View>
                ))}

                <Button
                    mode="contained"
                    onPress={handleSaveProfile}
                    style={{ marginTop: 20 }}
                    loading={isSaving}
                    disabled={isSaving || isSyncing}
                >
                    {isSaving ? "저장 중..." : "저장"}
                </Button>
            </ScrollView>

            <Snackbar
                visible={syncSnackVisible}
                onDismiss={() => setSyncSnackVisible(false)}
                duration={3000}
                action={{
                    label: "확인",
                    onPress: () => setSyncSnackVisible(false),
                }}
            >
                {syncMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: { fontSize: 20, fontWeight: "bold" },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    statusMessage: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
});
