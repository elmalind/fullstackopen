import { useState, useEffect } from "react";
import Forms from "./components/Forms";
import Lists from "./components/Lists";
import phonebook from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");

  useEffect(() => {
    phonebook.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const exists = persons.some((person) => person.name === newName);
    if (exists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    phonebook.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNumber("");
    });
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
