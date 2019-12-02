import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactUploadImage from "./ReactUploadImage"
function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <div>
        <ReactUploadImage/>
      </div>
      {/* </header> */}
    </div>
  );
}

export default App;
