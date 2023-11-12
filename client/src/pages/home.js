import { Outlet, Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div classname={ "home" }>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <h1>hello</h1>
        <p>world</p>
        <p>add short intro text body</p>
        <p>add button for new dream entry</p>
        <p>add navigation bar?</p>
        <p>add button to view old entries</p>
      </div>
      <Outlet />
    </>
  );
};

export default Home;