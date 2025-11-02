const express = require('express');
const router = express.Router();
const { setOktaUserPassword } = require('../../functions/users/resetPassword');
const { resetMatchedFactors } = require('../../functions/users/mfa');

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

router.post('/reset-mfa', async (req, res) => {
    console.log('Received MFA reset request:', req.body);
    const { userId, factorsToReset } = req.body;

    if (!userId || !factorsToReset) {
        return res.status(400).json({ error: 'Missing userId or factors' });
    }

    try {
        const result = await resetMatchedFactors(userId, factorsToReset);
        res.status(200).json({ message: 'MFA reset successful', data: result.data });
    } catch (error) {
        res.status(500).json({ message: 'MFA reset failed', error: error.message });
    }
});

module.exports = router;