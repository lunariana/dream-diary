import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

const PageNotFound = () => {

  const navigate = useNavigate();

  return (
    <>
      <Header/>
      <div className="page-not-found">
        {/* ///////////////////////////////////////// INSERT SOME IMAGE HEREEEEEEEEE */}
        {/* <br/> */}
        <h1>huh?</h1>
        <p>is this a dream? looks like this page doesn't exist...</p>
        {/* <br/> */}
        <img className="purple-moon" src='../../img/purple-moon.png' alt="purple moon" onClick={ () => { navigate(-1); } } />
        <br/>
        <br/>
        <br/>
        {/* <br/> */}
        {/* <br/> */}
        <p className='hint'>psst! click on the big moon to <strong>go back</strong> to reality :)</p>
        {/* <button onClick={ () => { navigate(-1); } }>go back</button> */}
      </div>
    </>
  );
};

export default PageNotFound;
