import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddVehicle.css";

function AddVehicle({}) {
  const [scenarios, setScenarios] = useState([]);
  const [vehicle, setVehicle] = useState({
    selectedScenario: "",
    name: "",
    initialPositionX: "",
    initialPositionY: "",
    speed: "",
    direction: "Towards",
  });

  useEffect(() => {
    // Load scenario data from local storage
    const storedScenarios = Object.keys(localStorage)
      .filter((key) => key.startsWith("scenario_"))
      .map((key) => JSON.parse(localStorage.getItem(key)));

    console.log("Stored Scenarios:", storedScenarios); // Check if scenarios are loaded

    setScenarios(storedScenarios);
  }, []);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVehicle({
      ...vehicle,
      [name]: value,
    });
  };

  const handleAddVehicle = () => {
    // Validate vehicle data
    if (
      vehicle.selectedScenario &&
      vehicle.name &&
      vehicle.initialPositionX &&
      vehicle.initialPositionY &&
      vehicle.speed &&
      vehicle.direction
    ) {
      // Get the last assigned vehicle ID from local storage
      let lastAssignedVehicleId = parseInt(localStorage.getItem("lastAssignedVehicleId")) || 0;

      // Increment the vehicle ID for the new vehicle
      lastAssignedVehicleId++;

      let vehicles =
        localStorage.getItem(`vehi_scenario_${vehicle.selectedScenario}`) ||
        "[]";
      vehicles = JSON.parse(vehicles);
      vehicles.push(vehicle);
      localStorage.setItem(
        `vehi_scenario_${vehicle.selectedScenario}`,
        JSON.stringify(vehicles)
      );

      // Create the vehicle data object with the new ID
      const vehicleData = {
        id: lastAssignedVehicleId.toString(),
        selectedScenario: vehicle.selectedScenario,
        name: vehicle.name,
        initialPositionX: vehicle.initialPositionX,
        initialPositionY: vehicle.initialPositionY,
        speed: vehicle.speed,
        direction: vehicle.direction,
      };

      // Save the vehicle data to local storage
      localStorage.setItem(`vehicle_${lastAssignedVehicleId}`, JSON.stringify(vehicleData));

      // Update the last assigned vehicle ID in local storage
      localStorage.setItem("lastAssignedVehicleId", lastAssignedVehicleId.toString());

      // Reset the form fields
      setVehicle({
        selectedScenario: "",
        name: "",
        initialPositionX: "",
        initialPositionY: "",
        speed: "",
        direction: "Towards",
      });

      // Navigate to the Home page
      navigate("/");
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleResetForm = () => {
    // Reset the form fields
    setVehicle({
      selectedScenario: "",
      name: "",
      initialPositionX: "",
      initialPositionY: "",
      speed: "",
      direction: "Towards",
    });
  };

  return (
    <div className="add-vehicle-container">
      <h2>Add Vehicle</h2>
      
      <form>
        <div className="input-group">
          <div>
            <label>Select Scenario:</label>
            <select
              name="selectedScenario"
              value={vehicle.selectedScenario}
              onChange={handleInputChange}
            >
              <option value="">Select a Scenario</option>

              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Vehicle Name:</label>
            <input
              type="text"
              name="name"
              value={vehicle.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Initial Position X:</label>
            <input
              type="text"
              name="initialPositionX"
              value={vehicle.initialPositionX}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label>Initial Position Y:</label>
            <input
              type="text"
              name="initialPositionY"
              value={vehicle.initialPositionY}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Speed:</label>
            <input
              type="text"
              name="speed"
              value={vehicle.speed}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Direction:</label>
            <select
              name="direction"
              value={vehicle.direction}
              onChange={handleInputChange}
            >
              <option value="Towards">Towards</option>
              <option value="Backwards">Backwards</option>
              <option value="Upwards">Upwards</option>
              <option value="Downwards">Downwards</option>
            </select>
          </div>
        </div>
      </form>
      <div style={{marginLeft:"  350px"}}>
        <button style={{backgroundColor:"green"}}onClick={handleAddVehicle}>Add </button>
        <button style={{backgroundColor:"orange"}} onClick={handleResetForm}>Reset</button>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    </div>
  );
}

export default AddVehicle;
