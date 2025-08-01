import { useTranslation } from 'react-i18next';

export const getPasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) score++;
    if (password.length >= 15) score++;
    if (password.length >= 20) score++;
    return score;
};

export const getStrengthColor = (passwordStrength: number) => {
    switch (passwordStrength) {
        case 1: return "bg-red-500";
        case 2: return "bg-yellow-400";
        case 3: return "bg-green-600";
        case 4: return "bg-green-600";
        default: return "bg-gray-300";
    }
};

export const getStrengthLabel = (passwordStrength: number) => {
    const { t } = useTranslation();
    
    switch (passwordStrength) {
        case 1: return t("Паролата е твърде слаба.");
        case 2: return t("Паролата е средно сигурна.");
        case 3: return t("Паролата е с високо ниво на сигурност.");
        case 4: return t("Паролата е максимално сигурна.");
        default: return t("Сигурност на парола.");
    }
};