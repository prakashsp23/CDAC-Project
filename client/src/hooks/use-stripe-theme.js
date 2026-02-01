import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/components/theme-provider';

export function useStripeTheme() {
    const { theme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
             // Check standard dark mode class on html/root
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        };

        checkTheme();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    checkTheme();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, [theme]);

    const appearance = useMemo(() => ({
        theme: isDarkMode ? 'night' : 'stripe',
        variables: {
            colorPrimary: isDarkMode ? '#ffffff' : '#0f172a',
            borderRadius: '0.5rem',
            // Zinc theme muted colors to match 'Total Amount' box
            colorBackground: isDarkMode ? '#27272a' : '#f4f4f5',
            colorText: isDarkMode ? '#fafafa' : '#09090b',
            colorDanger: '#ef4444',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
        },
        rules: {
            '.Input': {
                border: '1px solid transparent',
                boxShadow: 'none',
            },
            '.Input:focus': {
                border: isDarkMode ? '1px solid #ffffff' : '1px solid #0f172a',
                boxShadow: 'none',
            },
        }
    }), [isDarkMode]);

    return appearance;
}
