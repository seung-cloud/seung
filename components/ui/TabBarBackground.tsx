import { StyleSheet, View } from "react-native";

export default function TabBarBackground(props: any) {
    const style = props && props.style ? props.style : {};
    return <View style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        opacity: 0.9,
        flex: 1,
        height: 50, // ✅ 탭바 높이만큼만 제한
    },
});
