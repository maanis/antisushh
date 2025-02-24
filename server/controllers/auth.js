const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');

const register = async function (req, res) {
    const { name, username, password } = req.body;
    try {

        const exist = await userModel.findOne({ username });

        if (exist) {
            res.send('user already exist');
            return;
        }
        const hassPass = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            username,
            password: hassPass
        });
        res.send(user);
    } catch (error) {
        res.send('internal server error');
        res.send(error);
    }
}

const login = async function (req, res) {
    const { username, password } = req.body;
    try {

        const exist = await userModel.findOne({ username });

        if (!exist) {
            res.send('user not exist');
            return;
        }
        const isMatch = await bcrypt.compare(password, exist.password);
        if (!isMatch) {
            res.send('Wrong credentials');
            return;
        }
        res.send(exist);
    } catch (error) {
        res.send('internal server error');
        res.send(error);
    }
}



module.exports = { register, login };