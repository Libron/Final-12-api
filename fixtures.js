const mongoose = require('mongoose');
const nanoid = require('nanoid');
const loremIpsum = require("lorem-ipsum").loremIpsum;

const library = require('./library');
const config = require('./config');

const Photo = require('./models/Photo');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    const PICTURES =['photo1.jpg', 'photo2.jpeg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'];

    const generateRandomPhotos = (userList) => {
        const gallery = [];
        for (let i = 0; i < library.getRndInteger(10, 50); i++) {
            gallery.push({
                title: loremIpsum(),
                image: library.random(PICTURES),
                user: library.random(userList)._id
            });
        }
        return gallery;
    };

    const users = await User.create(
        {
            username: 'ywvekokoqe_1558762951@tfbnw.net',
            facebookId: '100037060248963',
            name: 'Abigail Alcgjfjbdhifc Occhinoberg',
            password: '111aaa',
            role: 'user',
            token: nanoid(),
            avatar: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=109980593577521&height=50&width=50&ext=1561277553&hash=AeQt7Ybkjlpi2F6W'
        },
        {
            username: 'ovyjzepejk_1558762957@tfbnw.net',
            facebookId: '100037016032192',
            name: 'Ullrich Alcgjafjcbaib Lauescu',
            password: '111aaa',
            role: 'admin',
            token: nanoid(),
            avatar: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=100938861158493&height=50&width=50&ext=1561277235&hash=AeQeTINEFa7naa40'
        },
        {
            username: 'gena',
            facebookId: '',
            name: 'Gena Michalysh',
            password: '123',
            role: 'admin',
            token: nanoid(),
            avatar: 'artist2.jpg'
        },
        {
            username: 'irina',
            facebookId: '',
            name: 'Irina Hakamada',
            password: '123',
            role: 'user',
            token: nanoid(),
            avatar: 'artist1.jpg'
        }

    );

    const photos = generateRandomPhotos(users);
    await Photo.create(
        ...photos
    );

    return connection.close();
};

run().catch(error => {
    console.error('Something went wrong, please check Fixtures.js !', error);
});