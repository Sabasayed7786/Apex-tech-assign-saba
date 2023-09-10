
import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import AddScenario from "./components/AddScenario/AddScenario";
import AllScenario from "./components/AllScenario/AllScenario";
import AddVehicle from "./components/AddVehicle/AddVehicle";
import "./App.css"

function App() {
  const [scenarios, setScenarios] = useState([]);

  
  const addScenario = (newScenario) => {
    setScenarios([...scenarios, newScenario]);
  };


  return (
    <div  >
    <Router>
      <div><Sidebar />
        <Routes>
          
          <Route path="/" element={<Home/>} />
          <Route path="/add-scenario" element={<AddScenario scenarios={scenarios} />} />
          <Route path="/all-scenario" element={<AllScenario scenarios={scenarios} />} />
          <Route path="/add-vehicle" element={<AddVehicle scenarios={scenarios}  />} />
        </Routes>
        </div>
      </Router>
      </div>
      
  );
}

export default App;

