import type { IconType } from "react-icons";
import { FaMoneyBillAlt, FaArchive, FaPen, FaUniversity, FaChartLine, FaRegNewspaper, FaTag, FaApple }
    from "react-icons/fa";
import { PiCoinsFill } from "react-icons/pi";
import { AiFillPieChart } from "react-icons/ai";
import { IoMdList, IoIosListBox } from "react-icons/io";
import { BsSafeFill, BsInfoLg } from "react-icons/bs";
import { RiBankCardLine } from "react-icons/ri";
import { MdEditNote, MdEditDocument, MdCurrencyExchange } from "react-icons/md";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BiSolidWallet } from "react-icons/bi";
import { GrAtm } from "react-icons/gr";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { FaArrowUpLong, FaPenClip } from "react-icons/fa6";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { BsQuestionLg } from "react-icons/bs";
import { IoDocumentTextSharp, IoDocumentLockOutline } from "react-icons/io5";
import { BiSolidConversation } from "react-icons/bi";
import { MdMessage } from "react-icons/md";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { IoListCircleSharp } from "react-icons/io5";
import { FaPenAlt, FaWallet } from "react-icons/fa";
import { FaCreditCard, FaTable, FaHandHoldingDollar, FaUser } from "react-icons/fa6";
import { LuChartNoAxesCombined } from "react-icons/lu";

const iconMap: Record<string, IconType> = {
    //When the key and the value are the same, you can use the shorthand syntax
    FaApple,
    FaArrowUpLong,
    FaPenClip,
    FaMoneyBillAlt,
    FaArchive,
    FaPen,
    FaUniversity,
    FaChartLine,
    FaRegNewspaper,
    FaTag,
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
    FaPhone,
    FaEnvelope,
    TbClipboardList,
    BsQuestionLg,
    IoDocumentTextSharp,
    IoDocumentLockOutline,
    BiSolidConversation,
    MdMessage,
    IoNotificationsSharp,
    IoSettingsSharp,
    IoMdLogOut,
    MdCurrencyExchange,
};

export const moduleIconMap: Record<string, React.ReactNode> = {
    "Сметки": <IoListCircleSharp />,
    "Accounts": <IoListCircleSharp />,
    "За подпис": <FaPenAlt />,
    "For signing": <FaPenAlt />,
    "Карти": <FaCreditCard />,
    "Cards": <FaCreditCard />,
    "Депозити": <FaWallet />,
    "Deposits": <FaWallet />,
    "Кредити": <FaTable />,
    "Loans": <FaTable />,
    "Последни 5 превода": <FaHandHoldingDollar />,
    "Last 5 transfers": <FaHandHoldingDollar />,
    "Задължения": <BsSafeFill />,
    "Liabilities": <BsSafeFill />,
    "Валутни курсове": <LuChartNoAxesCombined />,
    "Exchange rates": <LuChartNoAxesCombined />,
    "Потребители": <FaUser />,
    "Users": <FaUser />,
}

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