const { Comment } = require('../models');

const commentData = [
    {
        comment_text: 'Up The Villa',
        user_id: 1,
        post_id: 1
    }
];

const seedComment = () => Comment.bulkCreate(commentData);

module.exports = seedComment;