const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const total = course.parts.reduce((a, b) => a + b.exercises, 0);

  return (
    <main>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </main>
  )
};

const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ parts }) => {
  return (
  <ul>
      <Part part={parts[0]}/>
      <Part part={parts[1]}/>
      <Part part={parts[2]}/>
  </ul>
  )
}

const Part = ({ part }) => <li><b>{part.name}: </b>{part.exercises} exercises</li>

const Total = ({ total }) => <p>Total exercises: {total}</p>

export default App;
