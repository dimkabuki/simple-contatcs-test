const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

const COUNTRIES = {
  1: { id: 1, name: 'Austria' },
  2: { id: 2, name: 'Germany' },
  3: { id: 3, name: 'Switzerland' },
};

const CONTACTS = {
  1: {
    id: 1,
    firstName: 'First 1',
    lastName: 'Last 1',
    street: 'Street 1',
    zip: '1000',
    city: 'City 1',
    country: 1,
    lastUpdatedAt: new Date(),
  },
  2: {
    id: 2,
    firstName: 'First 2',
    lastName: 'Last 2',
    street: 'Street 2',
    zip: '2000',
    city: 'City 2',
    country: 2,
    lastUpdatedAt: new Date(),
  },
  3: {
    id: 3,
    firstName: 'First 3',
    lastName: 'Last 3',
    street: 'Street 3',
    zip: '3000',
    city: 'City 2',
    country: 3,
    lastUpdatedAt: new Date(),
  },
};

app.use(bodyParser.json());
app.use(cors());

function isString(value) {
  return typeof value == 'string';
}

function checkNonEmptyStrings() {
  for (let i = 0; i < arguments.length; i++) {
    if (
      arguments[i] == null ||
      isString(arguments[i]) == false ||
      arguments[i].trim().length == 0
    )
      return false;
  }

  return true;
}

function isNumber(value) {
  return typeof value === 'number';
}

function newId() {
  return Math.max(...Object.keys(CONTACTS)) + 1;
}

function findCountry(id) {
  const parsedId = parseInt(id, 10);
  return COUNTRIES[parsedId];
}

function findContact(id) {
  const parsedId = parseInt(id, 10);
  return CONTACTS[parsedId];
}

app.get('/countries', (req, res) => {
  res.json(Object.values(COUNTRIES));
});

app.get('/contacts', (req, res) => {
  res.json(Object.values(CONTACTS));
});

app.post('/contacts', (req, res) => {
  const { firstName, lastName, street, zip, city, country } = req.body;
  if (
    checkNonEmptyStrings(firstName, lastName, street, zip, city) == false ||
    findCountry(country) == null
  )
    return res.status(400).end();

  const contact = {
    id: newId(),
    firstName,
    lastName,
    street,
    zip,
    city,
    country,
    lastUpdatedAt: new Date(),
  };
  CONTACTS[contact.id] = contact;

  res.status(201).json(contact);
});

app.get('/contacts/:id', (req, res) => {
  const contact = findContact(req.params.id);
  if (contact == null) return res.status(404).end();

  res.json(contact);
});

app.put('/contacts/:id', (req, res) => {
  const contact = findContact(req.params.id);
  if (contact == null) return res.status(404).end();

  const { firstName, lastName, street, zip, city, country } = req.body;
  if (
    checkNonEmptyStrings(firstName, lastName, street, zip, city) == false ||
    findCountry(country) == null
  )
    return res.status(400).end();

  const updated = {
    id: contact.id,
    firstName,
    lastName,
    street,
    zip,
    city,
    country: parseInt(country, 10),
    lastUpdatedAt: new Date(),
  };
  CONTACTS[contact.id] = updated;

  res.json(updated);
});

app.delete('/contacts/:id', (req, res) => {
  const contact = findContact(req.params.id);
  if (contact == null) return res.status(404).end();

  delete CONTACTS[contact.id];
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
