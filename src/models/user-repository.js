// const { users } = require('./db');
const uuid = require('uuid');
const { User } = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

exports.getUsers = async () => await User.findAll();

exports.getUserByFirstName =  async (firstName) => {
  return await User.findOne({ where: { firstName }});
};

exports.createUser = async (body) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(body.password, salt);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  await User.create(user);
};

exports.updateUser =  async (id, data)  => {
  const foundUser = await User.findOne({ where: { id } });

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(body.password, salt);

  if (!foundUser) {
    throw new Error('User not found');
  }

  await User.update({
    firstName: data.firstName || foundUser.firstName,
    lastName: data.lastName || foundUser.lastName,
    password: data.password ? hashedPassword : foundUser.password,
    isAdmin: data.isAdmin || foundUser.isAdmin,
  }, { where: { id } });
};

exports.deleteUser = async (id) => {
  await User.destroy({ where: { id } });
}
