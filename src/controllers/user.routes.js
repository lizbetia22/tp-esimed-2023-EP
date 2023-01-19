const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { Sequelize, Model, DataTypes } = require('sequelize');
const { User } = require('../models/user.model.js');
const { body, validationResult } = require('express-validator');
const guard = require('express-jwt-permissions')({
  requestProperty: 'auth',
});

router.get('/test-sqlite', async (req, res) => {

  
  const eliza = await User.create({
    firstName : 'Yelyzaveta',
    lastName: 'Piunova',
    password: 'qwerty'
  });
  
  const users = await User.findAll();
    
  res.send(users)
});

router.get('/', async (req, res) => {
  res.send( await userRepository.getUsers());
});

router.get('/:firstName',guard.check(['admin']), async (req, res) => {
  const foundUser = await userRepository.getUserByFirstName(req.params.firstName);

  if (!foundUser) {
    res.status(500).send('User not found');
    return;
  }
  
  res.send(foundUser);
});

router.post('/',
  body('firstName').isAlphanumeric(),
  body('lastName').isAlphanumeric(),
  body('password').isLength({ min: 5 }),
  body('isAdmin').isAlphanumeric(),

      async (req, res) => {
      const errors = validationResult(req);
          if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
    await userRepository.createUser(req.body);
    res.status(201).end();
});

router.put('/:id',guard.check(['admin']), async (req, res) => {
  await userRepository.updateUser(req.params.id, req.body).catch((err) => res.status(500).send(err.message));
  res.status(204).end();
});

router.delete('/:id', guard.check(['asmin']), async (req, res) => {
  await userRepository.deleteUser(req.params.id);
  res.status(204).end();
});

exports.initializeRoutes = () => router;
