import React, { useEffect } from "react";
import RootLayoutNav from "./RootLayoutNav";
import { useAuthStore } from "./stores/authStore";

export default function App() {
    const initialize = useAuthStore((state) => state.initialize);
    useEffect(() => {
        initialize();
    }, []);
    return <RootLayoutNav />;
}
