import People from "./People";

const Lists = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <People key={person.name} person={person} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default Lists;
