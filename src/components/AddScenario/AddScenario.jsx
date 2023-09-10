import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddScenario.css";

function AddScenario() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();

  const initialScenario = {
    id: "",
    name: "",
    time: "",
  };

  const [scenario, setScenario] = useState(initialScenario);
  const [timeError, setTimeError] = useState(""); // Added timeError state

  useEffect(() => {
    if (scenarioId) {
      // Load existing scenario data from local storage
      const storedScenario = localStorage.getItem(`scenario_${scenarioId}`);
      if (storedScenario) {
        setScenario(JSON.parse(storedScenario));
      }
    }
  }, [scenarioId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "time") {
      // Allow empty input or positive floating-point numbers
      if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
        setScenario({
          ...scenario,
          [name]: value,
        });
        setTimeError(""); // Clear the timeError
      } else {
        setTimeError("Time must be a non-negative number.");
      }
    } else {
      setScenario({
        ...scenario,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    // Validate the form before saving
    if (!scenario.name || !scenario.time || timeError) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Automatically generate scenario ID
    const nextScenarioId = getNextScenarioId();
    scenario.id = nextScenarioId;

    scenario.time = scenario.time + "s";

    // Save scenario data to local storage or other client-side storage
    localStorage.setItem(`scenario_${nextScenarioId}`, JSON.stringify(scenario));

    navigate("/all-scenario");
  };

  const handleReset = () => {
    // Reset the form to its initial state
    setScenario(initialScenario);
    setTimeError(""); // Clear the timeError
  };

  // Function to get the next available scenario ID
  const getNextScenarioId = () => {
    const storedScenarioIds = Object.keys(localStorage)
      .filter((key) => key.startsWith("scenario_"))
      .map((key) => parseInt(key.replace("scenario_", ""), 10));

    // Find the maximum existing ID and add 1 to get the next available ID
    const nextId = storedScenarioIds.length > 0 ? Math.max(...storedScenarioIds) + 1 : 1;

    return nextId;
  };

  return (
<div className="main-container">
    <h2>Add Scenario</h2>
    <div className="add-scenario-container">
      
      <form>
        <div className="input-row">
          <label>Scenario Name:</label>
          <input
            type="text"
            name="name"
            value={scenario.name}
            onChange={handleInputChange}
          />
        
          <label>Time (in seconds):</label>
          <input
            type="text"
            name="time"
            value={scenario.time}
            onChange={handleInputChange}
          />
          {timeError && <div className="error-message">{timeError}</div>}
        </div>
      </form>
      <div >
        <button style={{backgroundColor:"green"}}onClick={handleSave}>
          {scenarioId ? "Edit" : "Add"} Scenario
        </button>
        <button style={{backgroundColor:"orange"}} onClick={handleReset}>Reset</button>
        <button  onClick={() => navigate("/all-scenario")}>Go Back</button>
      </div>
    </div>
    </div>
  );
}

export default AddScenario;
