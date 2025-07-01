import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <Text style={styles.text}>탐색 화면 (Explore)</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
    },
});
