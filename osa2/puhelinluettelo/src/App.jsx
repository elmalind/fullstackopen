import { useState, useEffect } from "react";
import Forms from "./components/Forms";
import Lists from "./components/Lists";
import phonebook from "./services/phonebook";
import People from "./components/People";
import Notification from "./components/Notifications";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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
      setErrorMessage(`Added ${newName}`);
      setTimeout(() => setErrorMessage(null), 3000);
    });
  };

  const deletePerson = (id) => {
    phonebook.remove(id).then(() => {
      S;
      setPersons(persons.filter((person) => person.id !== id));
      setErrorMessage(`Deleted ${person.name}`);
      setTimeout(() => setErrorMessage(null), 3000);
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Forms
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNumber(e.target.value)}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Lists persons={persons} onDelete={deletePerson} />
    </div>
  );
};

export default App;
