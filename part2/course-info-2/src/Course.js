const Course = ({ course }) => {
  let sum = course.parts.reduce((a, b) => a + b.exercises, 0);

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </div>
  );
};

const Header = ({ course }) => <h2>{course}</h2>;

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Part = ({ part }) => (
  <p>
    {part.name}: {part.exercises}
  </p>
);

const Total = ({ sum }) => (
  <p>
    <b>total exercises: {sum}</b>
  </p>
);

export default Course;
