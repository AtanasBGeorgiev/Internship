import type { IconType } from "react-icons";
import { FaMoneyBillAlt, FaArchive, FaPen, FaUniversity, FaChartLine, FaRegNewspaper, FaTag, FaApple, }
    from "react-icons/fa";
import { PiCoinsFill } from "react-icons/pi";
import { AiFillPieChart } from "react-icons/ai";
import { IoMdList, IoIosListBox } from "react-icons/io";
import { BsSafeFill, BsInfoLg } from "react-icons/bs";
import { RiBankCardLine } from "react-icons/ri";
import { MdEditNote, MdEditDocument } from "react-icons/md";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BiSolidWallet } from "react-icons/bi";
import { GrAtm } from "react-icons/gr";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { FaArrowUpLong } from "react-icons/fa6";

const iconMap: Record<string, IconType> = {
    //When the key and the value are the same, you can use the shorthand syntax
    FaArrowUpLong,
    FaMoneyBillAlt,
    FaArchive,
    FaPen,
    FaUniversity,
    FaChartLine,
    FaRegNewspaper,
    FaTag,
    FaApple,
    PiCoinsFill,
    AiFillPieChart,
    IoMdList,
    IoIosListBox,
    BsSafeFill,
    BsInfoLg,
    RiBankCardLine,
    MdEditNote,
    MdEditDocument,
    SlEnvolopeLetter,
    BiSolidWallet,
    GrAtm,
    LuMonitor,
    TiVendorAndroid,
};

// Valid icon names for security validation
const validIconNames = new Set(Object.keys(iconMap));

export const renderIcon = (name?: string) => {
    if (!name || typeof name !== 'string') return null;
    
    // Security: Validate icon name against whitelist
    if (!validIconNames.has(name)) {
        console.warn(`Invalid icon name: ${name}`);
        return null;
    }
    
    const IconComponent = iconMap[name];
    return IconComponent ? <IconComponent /> : null;
};
