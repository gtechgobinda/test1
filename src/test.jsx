import axios from "axios";
import { useEffect, useState } from "react";

const Test = () => {
  const [campCodes, setCampCodes] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("");
  const [volunteerCard, setVolunteerCard] = useState("");
  const [submittedData, setSubmittedData] = useState([]);

  // Fetch Camp Codes on Component Mount
  useEffect(() => {
    fetchCampCodes();
  }, []);

  // API 1: Fetch Camp Codes
  const fetchCampCodes = async () => {
    try {
      const response = await axios.post(
        "http://103.165.118.214:8080/api/Vol_Camp_Code",
        {
          branch_ID: 1,
          type: "Dis",
        }
      );
      setCampCodes(response.data);
    } catch (error) {
      console.error("Error fetching camp codes:", error);
    }
  };

  // Submit Data to API 3
  const handleSubmit = async () => {
    if (!selectedCamp || !volunteerCard) {
      alert("Please select a camp and enter a volunteer card number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://103.165.118.214:8080/api/Return_Vol_Card",
        {
          branch_ID: 1,
          created_By: 1,
          rec_Type: "Dis",
          remarks: "",
          list_object: [
            {
              card_ID: 0, // Assuming placeholder value
              number: volunteerCard,
              camp_ID: selectedCamp,
            },
          ],
        }
      );

      // Assuming response has a structure with a discard status
      const discardStatus = response.data.isDiscarded ? "Yes" : "No";
      const newEntry = {
        serialNo: submittedData.length + 1,
        cardNumber: volunteerCard,
        isDiscarded: discardStatus,
      };

      setSubmittedData([...submittedData, newEntry]);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  console.log(campCodes, "hello");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Volunteer Card Management</h1>

      {/* Dropdown for Camp Codes */}
      <div>
        <label htmlFor="campDropdown">Select Camp Code:</label>
        <select
          id="campDropdown"
          value={selectedCamp}
          onChange={(e) => setSelectedCamp(e.target.value)}
        >
          <option value="">-- Select Camp --</option>
          {campCodes.map((camp) => (
            <option key={camp.camp_ID} value={camp.camp_ID}>
              {camp.camp_Code}
            </option>
          ))}
        </select>
      </div>

      {/* Input for Volunteer Card Number */}
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="volunteerCard">Volunteer Card Number:</label>
        <input
          type="text"
          id="volunteerCard"
          value={volunteerCard}
          onChange={(e) => setVolunteerCard(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* Table to Display Submitted Data */}
      <div style={{ marginTop: "20px" }}>
        <h2>Submitted Data</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Volunteer Card Number</th>
              <th>Is Discarded</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                <td>{data.serialNo}</td>
                <td>{data.cardNumber}</td>
                <td>{data.isDiscarded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Test;
