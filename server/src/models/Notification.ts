import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    title: String,
    message: String,
    date: { type: Date, default: Date.now },
    isRead: Boolean,
    isDeleted: Boolean
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;