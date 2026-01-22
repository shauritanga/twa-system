import React, { createContext, useContext, useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from './ThemeProvider';

const AntThemeContext = createContext();

export const useAntTheme = () => useContext(AntThemeContext);

export default function AntThemeProvider({ children }) {
    const { theme: themeMode } = useTheme();

    const antTheme = useMemo(() => {
        const isDark = themeMode === 'dark';
        
        return {
            token: {
                colorPrimary: '#1890ff',
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#ff4d4f',
                colorInfo: '#1890ff',
                colorTextBase: isDark ? '#e6e6e6' : '#000000',
                colorBgBase: isDark ? '#141414' : '#ffffff',
                borderRadius: 6,
                fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            },
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        };
    }, [themeMode]);

    return (
        <AntThemeContext.Provider value={{ theme: themeMode }}>
            <ConfigProvider theme={antTheme}>
                {children}
            </ConfigProvider>
        </AntThemeContext.Provider>
    );
}
