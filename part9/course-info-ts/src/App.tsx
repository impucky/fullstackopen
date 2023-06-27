import { courseParts, CoursePart } from "./courseData";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const App = () => {
  return (
    <div>
      <h1>Half-stack application development</h1>
      <Content parts={courseParts} />
      <Total sum={courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)} />
    </div>
  );
};

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h4>
            {part.name} - {part.exerciseCount}
          </h4>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h4>
            {part.name} - {part.exerciseCount}
          </h4>
          <p>Project exercises: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h4>
            {part.name} - {part.exerciseCount}
          </h4>
          <p>{part.description}</p>
          <p>
            Material: <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </p>
        </div>
      );
    case "special":
      return (
        <div>
          <h4>
            {part.name} - {part.exerciseCount}
          </h4>
          <p>{part.description}</p>
          <p>{part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Total = ({ sum }: { sum: number }) => {
  return <p>Total exercises: {sum}</p>;
};

export default App;
