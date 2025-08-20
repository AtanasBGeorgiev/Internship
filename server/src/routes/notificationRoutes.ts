import { Router, Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

const router = Router();

router.post('/post', (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /notification received!');
    try {
        const { userId, type, title, message, date, isRead, isDeleted } = req.body;
        const notification = new Notification({ userId, type, title, message, date, isRead, isDeleted });

        notification.save();
        return res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ error: 'Failed to create notification' });
    }
});

router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /notification received!');
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const notifications = await Notification.find({ userId, isDeleted: false }).select('-__v').lean();

        const cleanedNotifications = notifications.map(({ _id, date, ...rest }: any) => ({
            id: _id.toString(),
            date: date ? date.toISOString().split('T')[0].replace(/-/g, '/') : "",
            ...rest
        }));
        const countUnread = notifications.filter(notif => !notif.isRead).length;

        return res.status(200).json({ notifications: cleanedNotifications, countUnread });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    console.log('PUT /notification received!');
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(id, { isDeleted: true });
        return res.status(200).json({ message: "Notification updated successfully" });
    }
    catch (error) {
        console.error('Error updating notification:', error);
        return res.status(500).json({ error: 'Failed to update notification' });
    }
});

export default router;