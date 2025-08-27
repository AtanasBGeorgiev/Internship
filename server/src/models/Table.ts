import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    name_bg: { type: String, unique: true },
    name_en: { type: String, unique: true },
    defaultOrder: { type: Number, unique: true },
    isRestricted: Boolean,
    description_bg: String,
    description_en: String
});
const Table = mongoose.model('Table', tableSchema);
export default Table;