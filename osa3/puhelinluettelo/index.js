const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const password = process.env.MONGODB_PASSWORD || process.argv[2];

if (!password) {
  console.error("Password is required as environment variable MONGODB_PASSWORD or command line argument");
  process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@cluster0.ez6nqcg.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error("error connecting to MongoDB:", err.message);
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: "not found" });
      }
    })
    .catch(() => res.status(400).json({ error: "malformatted id" }));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => res.status(400).json({ error: "malformatted id" }));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  Person.findOne({ name }).then((existing) => {
    if (existing) {
      return res.status(409).json({ error: "name must be unique" });
    }

    Person.findOne({ number }).then((existingNum) => {
      if (existingNum) {
        return res.status(409).json({ error: "number must be unique" });
      }

      const person = new Person({ name, number });
      person.save().then((saved) => {
        res.status(201).json(saved);
      });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
