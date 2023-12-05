export const NavBar = (props) => {
  return (
    <div className="navbar bg-base-100">
      <p className="btn btn-ghost text-xl">Hello, {props.name}</p>
    </div>
  );
};
