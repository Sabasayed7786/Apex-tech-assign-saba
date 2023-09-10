
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Home.css";

function Home() {
  const [vehicleData, setVehicleData] = useState([]); // Add this line
  const [selectedScenario, setSelectedScenario] = useState("All"); // Initially show all scenarios
  const [scenarios, setScenarios] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Retrieve all vehicle data from localStorage
    const allVehicleData = Object.keys(localStorage)
      .filter((key) => key.startsWith("vehicle_"))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (error) {
          // Handle the error
          return null;
        }
      })
      .filter((data) => data !== null);

    setVehicleData(allVehicleData);

    // Extract unique scenarios from the vehicle data
    const uniqueScenarios = Array.from(new Set(allVehicleData.map((vehicle) => vehicle.selectedScenario)));
    setScenarios(["All", ...uniqueScenarios]);
  }, []);

  const graphRef = useRef(null);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const createGraph = () => {
    // Create the graph using D3.js
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(graphRef.current)
      .selectAll("svg")
      .data([null]) // Bind data to a single element
      .join("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales for X and Y axes based on your data range
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Add X and Y axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Filter vehicle data based on the selected scenario
    const updatedFilteredData =
      selectedScenario === "All"
        ? vehicleData
        : vehicleData.filter((vehicle) => vehicle.selectedScenario === selectedScenario);

    setFilteredData(updatedFilteredData);

    // Add circles for filtered vehicles with random colors
    svg
      .selectAll("circle")
      .data(updatedFilteredData, (d) => d.id)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.initialPositionX))
      .attr("cy", (d) => yScale(d.initialPositionY))
      .attr("r", 5) // Adjust the radius as needed
      .style("fill", () => getRandomColor()); // Set random color for each circle

    // Add vehicle ID labels
    svg
      .selectAll(".vehicle-label")
      .data(updatedFilteredData, (d) => d.id)
      .enter()
      .append("text")
      .attr("class", "vehicle-label")
      .attr("x", (d) => xScale(d.initialPositionX))
      .attr("y", (d) => yScale(d.initialPositionY) - 10) // Adjust the vertical position
      .text((d) => d.id)
      .attr("text-anchor", "middle") // Center-align text horizontally
      .style("font-size", "10px"); // Adjust font size as needed
  };

  useEffect(() => {
    createGraph();
  }, [vehicleData, selectedScenario]);

  const handleEdit = (id) => {
    // Find the vehicle with the given ID
    const vehicleToEdit = vehicleData.find((vehicle) => vehicle.id === id);

    if (vehicleToEdit) {
      // Implement your edit logic here
      const updatedName = prompt("Enter the updated name:", vehicleToEdit.name);

      if (updatedName !== null) {
        // User clicked OK in the prompt
        const updatedData = vehicleData.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, name: updatedName } : vehicle
        );

        setVehicleData(updatedData);

        // Update the data in localStorage as well
        localStorage.setItem(`vehicle_${id}`, JSON.stringify({ ...vehicleToEdit, name: updatedName }));
      }
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");

    if (confirmDelete) {
      // Implement your delete logic here
      const updatedData = vehicleData.filter((vehicle) => vehicle.id !== id);
      setVehicleData(updatedData);

      // Remove the data from localStorage
      localStorage.removeItem(`vehicle_${id}`);
    }
  };

  return (
    <div className="main-container1">
    <div className="home-container">
      
      <h3>Filter Vehicles by Scenario:</h3>
      <select
        value={selectedScenario}
        onChange={(e) => setSelectedScenario(e.target.value)}
      >
        {scenarios.map((scenario) => (
          <option key={scenario} value={scenario}>
            {scenario}
          </option>
        ))}
      </select>
      <h3>Vehicle Data</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Vehicle Name</th>
            <th>Scenario</th>
            <th>Initial Position (X, Y)</th>
            <th>Speed</th>
            <th>Direction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.selectedScenario}</td>
              <td>
                ({data.initialPositionX}, {data.initialPositionY})
              </td>
              <td>{data.speed}</td>
              <td>{data.direction}</td>
              <td>
                <button onClick={() => handleEdit(data.id)}>Edit</button>
                <button onClick={() => handleDelete(data.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-div">
      <button className="button" style={{backgroundColor:"green"}}>Start Simulation</button>
      <button className="button">Stop Simulation</button>
      </div>
      <div ref={graphRef}></div>
    </div>
    </div>
  );
}

export default Home;
