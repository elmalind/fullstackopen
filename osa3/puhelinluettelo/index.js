const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

const persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Marja Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    persons.splice(persons.indexOf(person), 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  if (persons.find((p) => p.name === newPerson.name)) {
    return res.status(409).json({ error: "name must be unique" });
  }

  if (persons.find((p) => p.number === newPerson.number)) {
    return res.status(409).json({ error: "number must be unique" });
  }

  newPerson.id = String(Math.floor(Math.random() * 1000000));
  persons.push(newPerson);

  res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
