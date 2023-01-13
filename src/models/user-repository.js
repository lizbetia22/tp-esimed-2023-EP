const { users } = require('./db');
const uuid = require('uuid');
const md5 = require('md5');
const { User } = require('../models/user.model.js');

exports.getUsers = async () => await User.findAll();

exports.getUserByFirstName =  async (firstName) => {
  return await User.findOne({ where: { firstName }});
};

exports.createUser = async (body) => {
  const hashedPassword = md5(body.password);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  await User.create(user);
};

exports.updateUser =  async (id, data)  => {
  const foundUser = await User.findOne({ where: { id } });

  if (!foundUser) {
    throw new Error('User not found');
  }

  await User.update({
    firstName: data.firstName || foundUser.firstName,
    lastName: data.lastName || foundUser.lastName,
    password: data.password ? md5(data.password) : foundUser.password,
  }, { where: { id } });
};

exports.deleteUser = async (id) => {
  await User.destroy({ where: { id } });
}
