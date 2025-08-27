import mongoose from 'mongoose';

const preferredTableSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tables: [{
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
        order: { type: Number, default: 0 }
    }]
});

const PreferredTable = mongoose.model('PreferredTable', preferredTableSchema);
export default PreferredTable;
