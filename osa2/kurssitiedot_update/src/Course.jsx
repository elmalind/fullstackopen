const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

const Title = ({ title }) => {
  return <h1>Web development courses</h1>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Title title />
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>total of {total} excercises</p>;
};

export default Course;
