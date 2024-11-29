import { useState, useEffect } from "react";
import axios from "axios";

const VolunteerForm = () => {
  const [campCodes, setCampCodes] = useState([]);
  const [selectedCampCode, setSelectedCampCode] = useState("");
  const [volunteerCardNumber, setVolunteerCardNumber] = useState("");
  const [tableData, setTableData] = useState([]);
  const [serialCounter, setSerialCounter] = useState(1);

  // Fetch Camp Codes
  useEffect(() => {
    const fetchCampCodes = async () => {
      try {
        const response = await axios.post(
          "http://103.165.118.214:8080/api/Vol_Camp_Code",
          {
            branch_ID: 1,
            type: "Dis",
          }
        );
        if (response.data) {
          setCampCodes(response.data);
        }
      } catch (error) {
        console.error("Error fetching camp codes:", error);
      }
    };
    fetchCampCodes();
  }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampCode || !volunteerCardNumber) {
      alert("Please select a camp code and enter a volunteer card number.");
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
              card_ID: 0, // Placeholder as card_ID is not mapped in this flow
              number: volunteerCardNumber,
              camp_ID: selectedCampCode,
            },
          ],
        }
      );

      if (response.data[0]?.error_Message === "Success") {
        setTableData((prevData) => [
          ...prevData,
          {
            serial: serialCounter,
            volunteerCardNumber,
            isDiscarded: "No", // This should ideally come from API, hardcoded as "No"
          },
        ]);
        setSerialCounter(serialCounter + 1);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data.");
    }
  };

  return (
    <div>
      <h1>Volunteer Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Camp Code: </label>
          <select
            value={selectedCampCode}
            onChange={(e) => setSelectedCampCode(e.target.value)}
          >
            <option value="">--Select Camp Code--</option>
            {campCodes.map((camp) => (
              <option key={camp.camp_ID} value={camp.camp_ID}>
                {camp.camp_Code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Volunteer Card Number: </label>
          <input
            type="text"
            value={volunteerCardNumber}
            onChange={(e) => setVolunteerCardNumber(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

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
          {tableData.map((row) => (
            <tr key={row.serial}>
              <td>{row.serial}</td>
              <td>{row.volunteerCardNumber}</td>
              <td>{row.isDiscarded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerForm;
