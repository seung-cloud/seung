import React, { createContext, ReactNode, useContext } from "react";
import defaultTheme from "../themes/defaultTheme";

export interface Theme {
    appName: string;
    company_name: string; // ✅ 새로 추가
    colors: {
        primary: string;
        background: string;
        text: string;
        accent?: string; // ✅ 추가됨
        surface?: string; // ✅ 추가됨
        error?: string; // ✅ 추가됨
    };
    fonts: {
        main: string;
        headline: string;
        button: string;
    };
    icons?: {
        main?: string;
        consult?: string;
    };
    logo?: any;
    profileFields: string[];
    consultDetailsPrompt: string;
    extraDetailFields: Array<{
        name: string;
        label: string;
        multiline?: boolean;
        type?: "image" | "text";
    }>;
}

// 초기값을 명확히 기본값으로 설정할 때 타입을 Theme으로 명시합니다.
const ThemeContext = createContext<Theme>(defaultTheme as Theme);

export const useTheme = (): Theme => useContext(ThemeContext);

interface ThemeProviderProps {
    theme: Theme;
    children: ReactNode;
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);
