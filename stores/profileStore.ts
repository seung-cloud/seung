import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import apiClient from "../apiClient";

interface ProfileState {
    profile: Record<string, any>;
    loadProfile: (themeName: string) => Promise<void>;
    saveProfile: (
        themeName: string,
        profile: Record<string, any>
    ) => Promise<void>;
    saveProfileLocally: (
        themeName: string,
        profile: Record<string, any>
    ) => Promise<void>;
    syncWithServer: (themeName: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: {},

    loadProfile: async (themeName) => {
        let localProfileLoaded = false;

        try {
            // 먼저 로컬 데이터를 로드 (빠른 UI 표시를 위해)
            const localProfile = await AsyncStorage.getItem(
                `profile_${themeName}`
            );

            if (localProfile) {
                set({ profile: JSON.parse(localProfile) });
                localProfileLoaded = true;
                console.log("로컬 프로필 로드됨:", themeName);
            }

            // 로컬 로드 여부와 관계없이 항상 서버에서도 데이터를 가져옴 (최신 상태 유지)
            try {
                const response = await apiClient.get(
                    `/user/profile?theme=${themeName}`
                );

                if (response.status === 200 && response.data.profile) {
                    // 서버 데이터로 업데이트
                    set({ profile: response.data.profile });

                    // 로컬에도 최신 상태 저장
                    await AsyncStorage.setItem(
                        `profile_${themeName}`,
                        JSON.stringify(response.data.profile)
                    );
                    console.log("서버 프로필 로드됨:", themeName);
                    return;
                }
            } catch (serverError) {
                console.error("서버 프로필 로드 실패:", serverError);
                // 서버 로드 실패지만 로컬 데이터가 있으면 계속 진행
                if (localProfileLoaded) return;
            }

            // 로컬도 없고 서버도 실패하면 빈 프로필
            if (!localProfileLoaded) {
                set({ profile: {} });
            }
        } catch (error) {
            console.error("프로필 로드 중 오류 발생:", error);
            set({ profile: {} });
        }
    },

    saveProfile: async (themeName, profile) => {
        try {
            // 서버에 저장 시도
            const response = await apiClient.post("/user/profile", {
                theme: themeName,
                profile: profile,
            });

            if (response.status === 200) {
                // 서버 저장 성공 시 로컬에도 저장
                await AsyncStorage.setItem(
                    `profile_${themeName}`,
                    JSON.stringify(profile)
                );
                set({ profile });
                return;
            } else {
                throw new Error("서버 응답이 올바르지 않습니다");
            }
        } catch (error) {
            console.error("서버 프로필 저장 실패:", error);
            // 서버 저장 실패 시 로컬에만 저장 시도
            try {
                await AsyncStorage.setItem(
                    `profile_${themeName}`,
                    JSON.stringify(profile)
                );
                set({ profile });
                console.log("로컬에만 프로필이 저장되었습니다");
                // 여전히 성공으로 간주하지만 로깅
            } catch (localError) {
                console.error("로컬 프로필 저장 실패:", localError);
                throw new Error("프로필을 저장할 수 없습니다");
            }
        }
    },

    saveProfileLocally: async (themeName, profile) => {
        try {
            await AsyncStorage.setItem(
                `profile_${themeName}`,
                JSON.stringify(profile)
            );
            set({ profile });
        } catch (error) {
            console.error("로컬 프로필 저장 실패:", error);
            throw error;
        }
    },

    // 서버와 동기화를 수동으로 시도하는 함수
    syncWithServer: async (themeName) => {
        try {
            // 현재 로컬 프로필 가져오기
            const currentProfile = get().profile;

            // 서버에 저장 시도
            const response = await apiClient.post("/user/profile", {
                theme: themeName,
                profile: currentProfile,
            });

            if (response.status === 200) {
                console.log("프로필 서버 동기화 성공");
                return true;
            }
            return false;
        } catch (error) {
            console.error("프로필 서버 동기화 실패:", error);
            return false;
        }
    },
}));
