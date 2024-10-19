import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  const getDoctorsData = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
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

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

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
      loading,
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
