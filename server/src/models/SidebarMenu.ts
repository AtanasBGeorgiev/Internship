import mongoose from 'mongoose';

// Schema for Button interface
const ButtonSchema = new mongoose.Schema({
    href: { type: String, required: true },
    icons: [{ type: String, required: true }],
    label: { type: String, required: true },
    style: { type: String }
});

// Schema for MultiLevelSidebarProps interface
const MultiLevelSidebarPropsSchema = new mongoose.Schema({
    href: { type: String },
    title: { type: String },
    label: { type: String, required: true },
    icons: [{ type: String }],
    fontSize: { type: String },
    onClick: { type: String }, // Function reference
    hover: { type: String },
    position: { type: String },
    groupClass: { type: String },
    level: { type: Number },
    nextLevel: [{ type: mongoose.Schema.Types.Mixed }] // Recursive reference
});

// Schema for MenuItem interface
const MenuItemSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        enum: ['button', 'collapsible', 'multi-level'] 
    },
    titleCollapse: { type: String },
    collapsibleItem: [MultiLevelSidebarPropsSchema],
    multiLevelItems: [MultiLevelSidebarPropsSchema],
    buttonItem: ButtonSchema
});

// Main sidebar menu schema
const SidebarMenuSchema = new mongoose.Schema({
    userRole: { type: String, enum: ["user", "admin"] },
    menu: [MenuItemSchema]
}, 
//Adds creationd and update date
{
    timestamps: true
});

//Checks if the model exists, if not, create it
export default mongoose.models.SidebarMenu || mongoose.model('SidebarMenu', SidebarMenuSchema);