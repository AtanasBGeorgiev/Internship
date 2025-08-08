import { useState } from "react";

//items: T[]=[] - if T{} is undefined replaces with empty []
export function useSelectableList<T extends { id: string }>(items: T[] = []) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const allSelected = selectedItems.length === items.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(item => item.id));
        }
    };

    const toggleItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    return {
        selectedItems,
        allSelected,
        toggleSelectAll,
        toggleItem,
        setSelectedItems,
    };
}

interface GroupCheckboxProps {
    type?: "parent" | "child";
    allSelected?: boolean;
    toggleSelectAll?: () => void;
    isSelected?: boolean;
    onToggle?: () => void;
}
export const GroupCheckbox: React.FC<GroupCheckboxProps> = ({ type = "child", allSelected, toggleSelectAll, isSelected, onToggle }) => {
    if (type === "parent") {
        return (
            <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
            />
        );
    }
    else {
        return (
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggle}
            />
        );
    }
};