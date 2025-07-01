import { StyleSheet, Text, View } from "react-native";

export default function LanguageSettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>언어 설정 화면</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: { fontSize: 20, fontWeight: "bold" },
});
