import axios from "axios";
import { useEffect, useState } from "react";
import Test from "./test.jsx";
import VolunteerForm from "./test2.jsx";

const App = () => {
  const [campCodesData, setCampCodeData] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("");
  const API_URL = "http://103.165.118.214:8080/api/";
  const fetchCampCode = async () => {
    try {
      const response = await axios.post(`${API_URL}Vol_Camp_Code`, {
        branch_ID: 1,
        type: "Dis",
      });
      console.log(response?.data, "helllo");
      setCampCodeData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchVolCardNumber

  useEffect(() => {
    fetchCampCode();
  }, []);
  return (
    <>
      <div>
        <label htmlFor="campDropdown">Select Camp Code:</label>
        <select name="" id="campDropdown">
          <option value="">-- Select Camp --</option>
          {campCodesData?.map((item, index) => (
            <option key={index}>{item?.camp_Code}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="volunteerCard">Volunteer Card Number</label>
        <input type="text" id="volunteerCard" />
      </div>
      {/* <Test /> */}

      <VolunteerForm />
    </>
  );
};

export default App;
