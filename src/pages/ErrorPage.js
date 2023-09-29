import { useRouteError } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <Header />
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-xl">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="m-2 rounded-xl border-2 border-slate-500 p-3">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
      <NavBar />
    </>
  );
}
