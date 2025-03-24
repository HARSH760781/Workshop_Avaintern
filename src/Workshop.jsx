import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AccountCircle,
  Email,
  Phone,
  School,
  MenuBook,
  CalendarToday,
  Badge,
  Apartment,
  Code,
  Numbers,
  YouTube,
} from "@mui/icons-material";
import "./Workshop.css";
import { Facebook, LinkedIn, Twitter, Instagram } from "@mui/icons-material";

const Workshop = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id");
  const sheetName = searchParams.get("sheet") || "Sheet1"; // Default to "Sheet1"
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("YO", sheetName);

  // Define sheet IDs using .env variables
  const sheetIds = import.meta.env.VITE_APP_SHEET_ID_1;

  // Define column mappings for each sheet
  const columnMappings = {
    Sheet1: {
      id: "C.ID", // Column for ID in Sheet1
      name: "Name", // Column for Name in Sheet1
      course: "Course", // Column for Course in Sheet1
      date: "Date", // Column for Date in Sheet1
    },
    FS_Workshop: {
      id: "ID", // Column for ID in FS_Workshop
      name: "Name", // Column for Name in FS_Workshop
      course: "Course", // Column for Course in FS_Workshop
      date: "Date", // Column for Date in FS_Workshop
    },
  };

  const api_key = import.meta.env.VITE_APP_API_KEY;

  useEffect(() => {
    if (studentId) {
      const sheet_id = sheetIds; // Get the sheet ID based on the sheet name
      if (!sheet_id) {
        console.error("Invalid sheet name.");
        setStudentData(null);
        setLoading(false);
        return;
      }

      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/${sheetName}?key=${api_key}`;

      fetch(sheetUrl)
        .then((response) => response.json())
        .then((data) => {
          if (!data.values || data.values.length < 2) {
            console.error("Invalid or empty data received.");
            setStudentData(null);
            return;
          }

          const headers = data.values[0].map((header) =>
            header.trim().toLowerCase()
          );
          console.log("Headers:", headers);

          const idColumn = columnMappings[sheetName].id; // Get the ID column name for the current sheet
          const idIndex = headers.indexOf(idColumn.toLowerCase());
          if (idIndex === -1) {
            console.error("ID column not found.");
            setStudentData(null);
            return;
          }

          const studentRow = data.values.find(
            (row) => row[idIndex] === studentId
          );
          if (studentRow) {
            const studentObject = {};
            Object.entries(columnMappings[sheetName]).forEach(
              ([normalizedKey, sheetKey]) => {
                const columnIndex = headers.indexOf(sheetKey.toLowerCase());
                let value =
                  columnIndex !== -1 ? studentRow[columnIndex] : "N/A";
                studentObject[normalizedKey] = value;
              }
            );
            setStudentData(studentObject);
          } else {
            setStudentData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setStudentData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-text">Fetching Certificate details...</p>
      </div>
    );

  if (!studentData)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-text">
          Certificate details <span style={{ color: "red" }}> Not Found</span>
        </p>
      </div>
    );

  // Icons mapping for normalized field names
  const fieldIcons = {
    id: <Numbers fontSize="small" />,
    name: <AccountCircle fontSize="small" />,
    email: <Email fontSize="small" />,
    course: <MenuBook fontSize="small" />,
    date: <CalendarToday fontSize="small" />,
    qr: <Code fontSize="small" />,
    link: <Apartment fontSize="small" />,
  };

  // Order the fields based on the sheet
  const fieldOrder =
    sheetName === "Sheet1"
      ? ["id", "name", "email", "course", "date", "qr"] // Fields for Sheet1 (File 1)
      : ["id", "name", "course", "date"]; // Fields for Sheet1 (File 2)

  return (
    <>
      <div className="student-container">
        <div className="student-card">
          {/* Company Logo */}
          <div className="logo_write">
            <img src={"logo.jpg"} alt="Company Logo" className="company-logo" />
            <span>Ava</span>
            <span>Intern</span>
          </div>

          <h2> Verified Certificate</h2>
          <table className="student-table">
            <tbody>
              {fieldOrder
                .filter((key) => studentData[key])
                .map((key) => (
                  <tr key={key}>
                    <td className="table-label">
                      {fieldIcons[key]} {key}
                    </td>
                    <td className="table-value">{studentData[key]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Social Media Links */}
        </div>
      </div>
      <div style={{ flexGrow: 1 }}></div>

      <div className="social-media">
        <a
          href="https://www.avaintern.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="logo.jpg" alt="Logo" />
        </a>

        <a
          href="https://www.linkedin.com/company/ava-intern"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn fontSize="large" className="social-icon linkedin" />
        </a>
        <a
          href="https://www.youtube.com/@AvaInternEdutechPvt.Ltd."
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTube fontSize="large" className="social-icon twitter" />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram fontSize="large" className="social-icon instagram" />
        </a>
      </div>
    </>
  );
};

export default Workshop;
