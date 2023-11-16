import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DreamArchivePage from "./pages/dream-archive";
import DreamPage from "./pages/dream";
import NewDreamPage from "./pages/dream-new";
import EditDreamPage from "./pages/dream-edit";
import PageNotFound from "./pages/404";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="about" element={ <AboutPage/> }/>
          <Route path='login' element={ <LoginPage/> }/>
          <Route path='signup' element={ <SignupPage/> }/>
          <Route path="dream-archive" element={ <DreamArchivePage/> }/>
          <Route path="dream/:dreamID" element={ <DreamPage/> }/>
          <Route path="new-dream" element={ <NewDreamPage/> }/>
          <Route path="edit-dream/:dreamID" element={ <EditDreamPage/> }/>
          <Route path="*" element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
  
export default App;
