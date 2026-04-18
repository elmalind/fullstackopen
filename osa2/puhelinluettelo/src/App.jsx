import { useState } from "react";
import Forms from "./components/Forms";
import Lists from "./components/Lists";
import People from "./components/People";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    const exists = persons.some((person) => person.name === newName);
    if (exists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Forms
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNumber(e.target.value)}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Lists persons={persons} />
    </div>
  );
};

export default App;
