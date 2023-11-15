import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import LoginPage from "./pages/login";
import PageNotFound from "./pages/404";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="about" element={ <AboutPage/> }/>
          <Route path='login' element={ <LoginPage/> }/>
          {/* <Route path="*" element={ <PageNotFound/> }/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
  
export default App;