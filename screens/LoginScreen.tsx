import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen() {
    // Google 인증 요청 세팅
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '1045270424276-lji14qu7i6hhe6fs965rcm0eosggrre4.apps.googleusercontent.com',
        webClientId: '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', // 웹용 클라이언트 ID (웹 연동시)
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication) {
                Alert.alert('Google 로그인 성공!', 'Access Token: ' + authentication.accessToken);
            }
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Button
                title="Google로 로그인"
                disabled={!request}
                onPress={() => promptAsync()}
                color="#EA4335" // Google 레드 계열
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
