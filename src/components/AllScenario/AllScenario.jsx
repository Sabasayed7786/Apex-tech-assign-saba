import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllScenario.css';

function AllScenario() {
  const [scenarios, setScenarios] = useState([]);
  const [editingScenarioId, setEditingScenarioId] = useState(null);
  const [editedScenarioData, setEditedScenarioData] = useState({});
  const [vehicleData, setVehicleData] = useState([])

  useEffect(() => {
    // Load scenario data from local storage
    let storedScenarios = Object.keys(localStorage)
      .filter((key) => key.startsWith('scenario_'))
      .map((key) => JSON.parse(localStorage.getItem(key)));

    storedScenarios = storedScenarios.map((el) => {
      const vehicles =
        localStorage.getItem(`vehi_scenario_${el.id}`) || '[]';

      return { ...el, vehicles: JSON.parse(vehicles) };
    });

    setScenarios(storedScenarios);
  }, []);

  const handleDeleteScenario = (scenarioId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this scenario and its associated vehicles?"
    );
    if (confirmation) {
      // Delete scenario data from local storage
      localStorage.removeItem(`scenario_${scenarioId}`);

      // Delete associated vehicle data
      localStorage.removeItem(`vehicle_scenario_${scenarioId}`);

      // Update the scenarios state to reflect the deletion
      setScenarios((prevScenarios) =>
        prevScenarios.filter((scenario) => scenario.id !== scenarioId)
      );
    }
  };

  


  const handleEditScenario = (scenarioId) => {
    setEditingScenarioId(scenarioId);
    // Copy the scenario data to be edited
    setEditedScenarioData({ ...scenarios.find((scenario) => scenario.id === scenarioId) });
  };

  const handleSaveScenario = (scenarioId) => {
    // Update the scenario data in the state
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario) =>
        scenario.id === scenarioId ? editedScenarioData : scenario
      )
    );

    // Save edited scenario data to local storage
    localStorage.setItem(`scenario_${scenarioId}`, JSON.stringify(editedScenarioData));

    // Clear editing state
    setEditingScenarioId(null);
    setEditedScenarioData({});
  };

  const handleCancelEdit = () => {
    // Clear editing state
    setEditingScenarioId(null);
    setEditedScenarioData({});
  };

  const handleDeleteAllScenarios = () => {
    const confirmation = window.confirm("Are you sure you want to delete all scenarios?");
    if (confirmation) {
      // Delete all scenario and associated vehicle data from local storage
      Object.keys(localStorage)
        .filter((key) => key.startsWith("scenario_"))
        .forEach((key) => {
          const scenarioId = key.replace("scenario_", "");
          localStorage.removeItem(key);
          localStorage.removeItem(`vehicle_scenario_${scenarioId}`);
        });

      // Clear the scenarios state
      setScenarios([]);
    }
  };



  return (

    <div className='container'>
      <h2>All Scenarios</h2>
      <div className="button-group">
        <button style={{backgroundColor:"blue", textDecoration:"none"}}><Link style={{textDecoration:"none",color:"white"}}to={`/add-scenario`}>New Scenario</Link></button>
        <button style={{backgroundColor:"green",color:"white"}}><Link style={{textDecoration:"none",color:"white"}}to={`/add-vehicle`}>Add Vehicle</Link></button>
        <button style={{backgroundColor:"orange", }}onClick={handleDeleteAllScenarios}>Delete All</button>
      </div>
      <div  className="scenario-div">
      <table className="scenario-table"> {/* Add the scenario-table class to the table */}
        <thead className='table-head'>
          <tr>
            <th>Scenario ID</th>
            <th>Scenario Name</th>
            <th>Time</th>
            <th>Number of Vehicles</th>
            <th>Add Vehicle</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td>{scenario.id}</td>
              <td>
                {editingScenarioId === scenario.id ? (
                  <input
                    type="text"
                    value={editedScenarioData.name || ''}
                    onChange={(e) =>
                      setEditedScenarioData({
                        ...editedScenarioData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  scenario.name
                )}
              </td>
              <td>
                {editingScenarioId === scenario.id ? (
                  <input
                    type="text"
                    value={editedScenarioData.time || ''}
                    onChange={(e) =>
                      setEditedScenarioData({
                        ...editedScenarioData,
                        time: e.target.value,
                      })
                    }
                  />
                ) : (
                  scenario.time
                )}
              </td>
              <td>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
              <td>
                <Link style={{textDecoration:"none"}} to={`/add-vehicle`}>+</Link>
              </td>
              <td>
                {editingScenarioId === scenario.id ? (
                  <>
                    <button onClick={() => handleSaveScenario(scenario.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditScenario(scenario.id)}>Edit</button>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleDeleteScenario(scenario.id)}
                  className='delete-button'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AllScenario;