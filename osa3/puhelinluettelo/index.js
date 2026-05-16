const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const password = process.env.MONGODB_PASSWORD || process.argv[2];

if (!password) {
  console.error(
    "Password is required as environment variable MONGODB_PASSWORD or command line argument",
  );
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

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch(next);
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
    })
    .catch(next);
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        next(createError("not found", 404));
      }
    })
    .catch(next);
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return next(createError("name or number missing", 400));
  }

  Person.findOne({ name })
    .then((existing) => {
      if (existing) {
        throw createError("name must be unique", 409);
      }

      return Person.findOne({ number });
    })
    .then((existingNum) => {
      if (existingNum) {
        throw createError("number must be unique", 409);
      }

      const person = new Person({ name, number });
      return person.save();
    })
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch(next);
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  res.status(500).json({ error: "internal server error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
