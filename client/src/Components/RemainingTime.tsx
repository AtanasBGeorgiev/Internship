export const getRemainingDays = (date: Date) => {
    const remainingDays = Math.round((new Date(date).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000));
    return remainingDays;
};

export const getStrengthColorDate = (date: Date, type: "deposit" | "credit") => {
    const remainingDays = getRemainingDays(date);

    if (type === "credit") {
        if (remainingDays < 10) return "bg-red-500";
        if (remainingDays < 20) return "bg-yellow-400";
        return "bg-green-500";
    }
    else {
        if (remainingDays < 30) return "bg-blue-400";
        return "bg-blue-800";
    }
};