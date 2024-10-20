const express = require("express");
const User = require("../models/user");
const authConfig = require("../config/auth");

const router = express.Router();

router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    // grab values
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    // check if the user already exists
    const existingUser = await User.findOne({ username }); 
    // if user exists, dont bother creating a new user, send a message to the browser
    if (existingUser) {
        return res.send('User already exists');
    }

    // verify that the password and password confirmation match
    if (password !== confirmPassword) {
        return res.send('Passwords do not match');
    }
    // hash the password
    const hashPassword = authConfig.encryptPassword(password);
    // create a new user
    const newUser = {
        username,
        password: hashPassword
    };
    // save the user
    const user = await User.create(newUser);
    // respond back to the browser
    res.send(`Thank you for signing up ${user.username}`);
});


module.exports = router;