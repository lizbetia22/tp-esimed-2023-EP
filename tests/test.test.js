const request = require('supertest');

test('My super test', async () => {
  const res = await request(apiUrl)
    .post('/users')
    .send({
      firstName :"Eliza",
      lastName : "Eliza",
      isAdmin :   false,
      password : "qwerty"
    });

  expect(res.statusCode).toEqual(201);
  // expect(res.body).toHaveProperty('some data present in the body');
});