import { useState, useEffect } from "react";

export default function HookComponent() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: null,
  });

  const handleInput = (e) => {
    let input = e.target.name;

    switch (input) {
      case "name":
        setUser({ name: e.target.value, email: user.email, age: user.age });
        break;
      case "email":
        setUser({
          name: user.name,
          email: e.target.value,
          age: user.age,
        });
        break;
      case "age":
        setUser({
          name: user.name,
          email: user.email,
          age: e.target.value,
        });
        break;
      default:
        console.log("didnt handle a real input");
    }
  };

  // // runs once on mount - componentWillMount
  // useEffect(() => {
  //   console.log("Running once on load");
  // }, []);

  // // runs on mount and when count is updated - componentDidUpdate
  // useEffect(() => {
  //   console.log("Running when count changes");
  //   console.log(count);
  // }, [count]);

  // // life cycle method - ComponentWillUnmount
  // useEffect(() => {
  //   console.log("Running once on load");

  //   return () => {
  //     console.log("Running when we unmout. ");
  //   };
  // }, []);

  useEffect(() => {
    console.log("Running once on load");

    console.log("Running when count changes");
    console.log(count);

    console.log(user);

    return () => {
      console.log("Running when we unmount. ");
    };
  }, [count, user]);

  return (
    <div>
      <h1>Hello class</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>

      <br />
      <label>Name</label>
      <br />
      <input
        type="text"
        name="name"
        value={user.name}
        placeholder="Insert Username"
        onChange={(e) => handleInput(e)}
      />
      <br />

      <label>email</label>
      <input
        type="text"
        name="email"
        value={user.email}
        placeholder="Insert Email"
        onChange={(e) => handleInput(e)}
      />
      <br />

      <label>age</label>
      <input
        name="age"
        type="number"
        value={user.age}
        onChange={(e) => handleInput(e)}
      />
    </div>
  );
}
