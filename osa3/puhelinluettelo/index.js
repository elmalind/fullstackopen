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
  if (request.url === "/api/persons" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(persons));
  } else if (request.url === "/info") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
  } else if (
    request.url.startsWith("/api/persons/") &&
    request.method === "DELETE"
  ) {
    const id = request.url.split("/")[3];
    const person = persons.find((p) => p.id === id);

    if (person) {
      persons.splice(persons.indexOf(person), 1);
      response.writeHead(204); // 204 = No Content (poistettu onnistuneesti)
      response.end();
    } else {
      response.writeHead(404);
      response.end(JSON.stringify({ error: "not found" }));
    }
  } else if (
    request.url.startsWith("/api/persons/") &&
    request.method === "GET"
  ) {
    const id = request.url.split("/")[3];
    const person = persons.find((p) => p.id === id);

    if (person) {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(person));
    } else {
      response.writeHead(404);
      response.end(JSON.stringify({ error: "not found" }));
    }
  } else if (request.url === "/api/persons" && request.method === "POST") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      const newPerson = JSON.parse(body);
      newPerson.id = String(Math.floor(Math.random() * 1000000));
      persons.push(newPerson);

      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(newPerson));
    });
  }
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
