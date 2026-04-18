import People from "./People";

const Lists = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <People key={person.name} person={person} />
      ))}
    </div>
  )
};

export default Lists;
