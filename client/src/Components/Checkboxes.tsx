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
    condition: boolean;
    onChange: () => void;
};
export const GroupCheckbox: React.FC<GroupCheckboxProps> = ({ condition, onChange }) => {
    return (
        <input type="checkbox" checked={condition}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
    );
};

interface TableCheckboxProps {
    checkedCondition: boolean;
    disabledCondition?: boolean;
    onChange: () => void;
};
export const TableCheckbox: React.FC<TableCheckboxProps> = ({ checkedCondition, disabledCondition, onChange }) => {
    return (
        <input
            type="checkbox" checked={checkedCondition}
            onChange={onChange}
            disabled={disabledCondition}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
    );
};