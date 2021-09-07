const { User } = require('../models');

const userData = [
    {
        username: 'odders17',
        email: 'odders@gmail.com',
        password: 'avfc'
    }
];

const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser;