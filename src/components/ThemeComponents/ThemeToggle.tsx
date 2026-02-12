import {useTheme} from './ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-primary)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
            }}
        >
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
    );
};