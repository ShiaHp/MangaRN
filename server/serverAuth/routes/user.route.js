const express = require('express')
const router = express.Router()
const { login, register, profile, updateProfile } = require('../controllers/auth.controller.js')
const User = require('../models/user.model.js')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile/:id').get(profile).patch(updateProfile)
router.get('/reading-history/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.readingHistory);
});
router.put('/reading-history/:userId', async (req, res) => {
    const { mangaTitle, mangaId, lastChapter, lastPage } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
            $push: {
                readingHistory: {
                    mangaTitle,
                    lastChapter,
                    lastPage,
                    mangaId,
                },
            },
        },
        { new: true },
    );
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.readingHistory);
});
router.patch('/reading-history/:userId', async(req,res) => {
    try {
        const {  mangaId } = req.body;
        await User.findByIdAndUpdate(
            req.params.userId,
            {
                $pull: {
                    readingHistory: {
                        mangaId: mangaId
                    },
                },
            },
            { new: true },
        );
        res.status(200).json({
            message: 'Success'
        })
    }catch(err) {
        res.status(404).json({ message: err.message});
    }
})
router.get('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.favoritesManga);
    } catch (e) {
        res.status(404).send(e.message)
    }
})
router.put('/favorites/:userId', async (req, res) => {
    try {
        const { newMangaId } = req.body
        const userId = req.params.userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // check if id manga is already in the list, if not add it to, or remove it
        if (user.favoritesManga.includes(newMangaId)) {
            const index = user.favoritesManga.indexOf(newMangaId);
            if (index > -1) { 
                user.favoritesManga.splice(index, 1); 
            }
        } else {
            user.favoritesManga.push(newMangaId);
        }

        await user.save();
        res.status(200).json({ message: 'Success', user: user });
    } catch (e) {
        res.status(404).send(e.message)
    }
})
module.exports = router;