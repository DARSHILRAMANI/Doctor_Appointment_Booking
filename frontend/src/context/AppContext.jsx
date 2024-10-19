// // import { createContext, useState, useEffect, useMemo } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";

// // // Create the context for the app
// // export const AppContext = createContext();

// // const AppContextProvider = ({ children }) => {
// //   const currencySymbol = "$";
// //   const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure the backend URL is set

// //   const [doctors, setDoctors] = useState([]);
// //   const [loading, setLoading] = useState(true); // Loading state
// //   const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize from localStorage
// //   const [userData, setUserData] = useState(false);

// //   // Function to fetch doctor data
// //   const getDoctorsData = async () => {
// //     setLoading(true); // Start loading
// //     try {
// //       const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

// //       if (data.success) {
// //         setDoctors(data.doctors);
// //       } else {
// //         toast.error("Failed to fetch doctors list");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching doctor data:", error);
// //       toast.error(
// //         error.response?.data?.message || "Failed to fetch doctors data"
// //       );
// //     } finally {
// //       setLoading(false); // Stop loading
// //     }
// //   };

// //   const loadUserProfileData = async () => {
// //     try {
// //       const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
// //         headers: { token },
// //       });
// //       if (data.success) {
// //         setUserData(data.userData);
// //       } else {
// //         toast.error("Failed to load user profile");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching doctor data:", error);
// //       toast.error(
// //         error.response?.data?.message || "Failed to fetch doctors data"
// //       );
// //     }
// //   };

// //   // Fetch data on component mount
// //   useEffect(() => {
// //     getDoctorsData();
// //   }, []);

// //   useEffect(() => {
// //     if (token) {
// //       loadUserProfileData();
// //     } else {
// //       setUserData(false);
// //     }
// //   }, [token]);

// //   // Sync token with localStorage when it changes
// //   useEffect(() => {
// //     if (token) {
// //       localStorage.setItem("token", token);
// //     } else {
// //       localStorage.removeItem("token");
// //     }
// //   }, [token]);

// //   // Memoize the context value
// //   const value = useMemo(
// //     () => ({
// //       doctors,
// //       getDoctorsData,
// //       token,
// //       setToken,
// //       currencySymbol,
// //       userData,
// //       setUserData,
// //       loadUserProfileData,
// //       backendUrl,
// //       loading, // Include loading state in context
// //     }),
// //     [doctors, currencySymbol, loading, token, backendUrl, getDoctorsData]
// //   );

// //   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// // };

// // export default AppContextProvider;
// import {
//   createContext,
//   useState,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Create the context for the app
// export const AppContext = createContext();

// const AppContextProvider = ({ children }) => {
//   const currencySymbol = "$";
//   const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure the backend URL is set

//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize from localStorage
//   const [userData, setUserData] = useState(false);

//   // Function to fetch doctor data
//   const getDoctorsData = useCallback(async () => {
//     setLoading(true); // Start loading
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

//       if (data.success) {
//         setDoctors(data.doctors);
//       } else {
//         toast.error("Failed to fetch doctors list");
//       }
//     } catch (error) {
//       console.error("Error fetching doctor data:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to fetch doctors data"
//       );
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   }, [backendUrl]);

//   const loadUserProfileData = useCallback(async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
//         headers: { token },
//       });
//       if (data.success) {
//         setUserData(data.userData);
//       } else {
//         toast.error("Failed to load user profile");
//       }
//     } catch (error) {
//       console.error("Error fetching user profile data:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to fetch user profile data"
//       );
//     }
//   }, [token, backendUrl]);

//   // Fetch data on component mount
//   useEffect(() => {
//     getDoctorsData();
//   }, [getDoctorsData]);

//   useEffect(() => {
//     if (token) {
//       loadUserProfileData();
//     } else {
//       setUserData(false);
//     }
//   }, [token, loadUserProfileData]);

//   // Sync token with localStorage when it changes
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   // Memoize the context value
//   const value = useMemo(
//     () => ({
//       doctors,
//       getDoctorsData,
//       token,
//       setToken,
//       currencySymbol,
//       userData,
//       setUserData,
//       loadUserProfileData,
//       backendUrl,
//       loading, // Include loading state in context
//     }),
//     [
//       doctors,
//       currencySymbol,
//       loading,
//       token,
//       backendUrl,
//       getDoctorsData,
//       loadUserProfileData,
//     ]
//   );

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export default AppContextProvider;
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context for the app
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure the backend URL is set

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize from localStorage
  const [userData, setUserData] = useState(false);

  // Function to fetch doctor data
  const getDoctorsData = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors[0].available);
      } else {
        toast.error("Failed to fetch doctors list");
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch doctors data"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error("Failed to load user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch user profile data"
      );
    }
  }, [token, backendUrl]);

  // Fetch data on component mount
  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token, loadUserProfileData]);

  // Sync token with localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      doctors,
      getDoctorsData,
      token,
      setToken,
      currencySymbol,
      userData,
      setUserData,
      loadUserProfileData,
      backendUrl,
      loading, // Include loading state in context
    }),
    [
      doctors,
      currencySymbol,
      loading,
      token,
      backendUrl,
      getDoctorsData,
      loadUserProfileData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
