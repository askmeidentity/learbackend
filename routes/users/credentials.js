const express = require('express');
const router = express.Router();
const { setOktaUserPassword } = require('../../functions/users/resetPassword');

router.post('/set-password', async (req, res) => {
    const { userId, newPassword, expireNow } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ error: 'Missing userId or newPassword' });
    }

    try {
        const result = await setOktaUserPassword(userId, newPassword, expireNow);
        res.status(200).json({ message: 'Password set successful', data: result.data });
    } catch (error) {
        res.status(500).json({ message: 'Password set failed', error: error.message });
    }
});

module.exports = router;