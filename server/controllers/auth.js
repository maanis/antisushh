const userModel = require("../model/userModel");

const register = async function (req, res) {
    const { name, username, password } = req.body;
    try {

        const exist = await userModel.findOne({ username });

        if (exist) {
            res.send('user already exist');
            return;
        }

        const user = await userModel.create({
            name,
            username,
            password,
        });
        res.send(user);
    } catch (error) {
        res.send('internal server error');
    }

}

module.exports = { register };