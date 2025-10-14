import i18n from "../i18n";

import { getUserData } from "../services/authService";

export const getUserNamesByLanguage = (userRoleData: string[], language: string): string => {
    if (language === 'bg') {
        return userRoleData[3]; // nameCyrillic (Bulgarian)
    } else {
        return userRoleData[4]; // nameLatin (English)
    }
};

export const updateUserNames = async (setUserNames: (names: string) => void) => {
    try {
        const names = await getUserData();
        const currentLanguage = i18n.language || 'bg';
        setUserNames(getUserNamesByLanguage(names, currentLanguage));
    } catch (err) {
        console.error('Error updating user names:', err);
    }
};