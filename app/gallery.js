const express = require('express');
const multer = require('multer');
const path = require('path');

const config = require('../config');

const Photo = require('../models/Photo');

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
    try {
        const photos = await Photo.find();
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

module.exports = router;