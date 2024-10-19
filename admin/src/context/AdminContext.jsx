// // export default AdminContextProvider;
// import { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// // Create the context
// export const AdminContext = createContext();

// const AdminContextProvider = ({ children }) => {
//   // State for Admin Token
//   const [aToken, setAToken] = useState(
//     () => localStorage.getItem("aToken") || ""
//   );

//   const [doctors, setDoctors] = useState([]);
//   const [appointments, setAppointments] = useState([]);

//   // Fetch backend URL from environment variables
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const getAllDoctors = async () => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/all-doctors",
//         {},
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         setDoctors(data.doctors);
//         console.log(data.doctors);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Effect to update localStorage whenever aToken changes
//   useEffect(() => {
//     if (aToken) {
//       localStorage.setItem("aToken", aToken);
//     } else {
//       localStorage.removeItem("aToken"); // Remove token if it's empty
//     }
//   }, [aToken]);

//   // Function to clear token
//   const clearToken = () => {
//     setAToken("");
//   };

//   const changeAvailability = async (docId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/change-availability",
//         { docId },
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getAllDoctors();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(data.message);
//     }
//   };

//   const getAllAppointments = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
//         headers: { aToken },
//       });
//       if (data.success) {
//         setAppointments(data.appointments);
//         console.log(data.appointments);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(data.message);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/cancel-appointment",
//         { appointmentId },
//         { headers: { aToken } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getAllAppointments();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(data.message);
//     }
//   };
//   // Value that will be provided to all components using this context
//   const value = {
//     aToken,
//     setAToken,
//     clearToken,
//     backendUrl,
//     doctors,
//     appointments,
//     setAppointments,
//     getAllAppointments,
//     getAllDoctors,
//     changeAvailability,
//     cancelAppointment,
//   };

//   // Providing the context
//   return (
//     <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
//   );
// };

// export default AdminContextProvider;

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  // State for Admin Token
  const [aToken, setAToken] = useState(
    () => localStorage.getItem("aToken") || ""
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  // Fetch backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Effect to update localStorage whenever aToken changes
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken"); // Remove token if it's empty
    }
  }, [aToken]);

  // Function to clear token
  const clearToken = () => {
    setAToken("");
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken }, // Ensure aToken is defined and valid
      });

      if (data.success) {
        setDashData(data.dashData); // Assuming setDashData is a state setter function
        console.log(data.dashData);
      } else {
        toast.error(data.message); // Display error message
      }
    } catch (error) {
      toast.error(error.message); // Display any errors that occur during the request
    }
  };

  // Value that will be provided to all components using this context
  const value = {
    aToken,
    setAToken,
    clearToken,
    backendUrl,
    doctors,
    appointments,
    setAppointments,
    getAllAppointments,
    getAllDoctors,
    changeAvailability,
    cancelAppointment,
    dashData,
    getDashData,
  };

  // Providing the context
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
