const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const nanoid = require('nanoid');

const config = require('../config');

const Photo = require('../models/Photo');
const User = require('../models/User');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    let criteria = {};
    if (req.query.uid) {
        criteria.user = req.query.uid;
    }

    try {
        const photos = await Photo.find(criteria).populate('user');
        res.send(photos);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        res.send(photo);
    } catch(e) {
        res.sendStatus(500);
    }
});

router.delete('/:id', auth, async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
        return res.sendStatus(404);
    }

    if (!req.user._id.equals(photo.user._id)) {
        return res.sendStatus(403);
    }

    try {
        await photo.remove();
        res.send(photo);
    } catch (e) {
        res.status(500).send(e)
    }
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
    const data = {
        title: req.body.title,
        user: req.user._id,
    };

    if (req.file) {
        data.image = req.file.filename;
    }

    const photo = new Photo(data);

    try {
        await photo.save();
        return res.send(data);
    } catch (error) {
        return res.status(400).send(error)
    }
});

module.exports = router;