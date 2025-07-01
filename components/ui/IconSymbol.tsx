import { Text } from "react-native";

export function IconSymbol({ size, name, color }) {
    return <Text style={{ fontSize: size, color }}>{name}</Text>;
}
