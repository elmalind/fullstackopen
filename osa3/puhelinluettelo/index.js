const http = require("http");

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

const app = http.createServer((request, response) => {
  if (request.url === "/api/persons") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(persons));
  } else if (request.url === "/info") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
  }
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
