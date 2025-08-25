import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    defaultOrder: { type: Number, unique: true },
    isRestricted: Boolean,
    description: String
});
const Table = mongoose.model('Table', tableSchema);
export default Table;