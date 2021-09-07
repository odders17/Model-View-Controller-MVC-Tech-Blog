const { Post } = require('../models');

const postData = [
    {
        title: 'The Mighty Claret and Blue',
        content: 'Just seeded!',
        user_id: 1
    }
];

const seedPost = () => Post.bulkCreate(postData);

module.exports = seedPost;