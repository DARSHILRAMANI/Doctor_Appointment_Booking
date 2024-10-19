import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import Doctorslist from "./pages/Admin/Doctorslist";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <div className="flex items-start">
        <Sidebar></Sidebar>
        <Routes>
          {/* admin  */}
          <Route path="/" element={<></>}></Route>
          <Route
            path="/admin-dashboard"
            element={<Dashboard></Dashboard>}
          ></Route>
          <Route
            path="/all-appointments"
            element={<AllAppointments></AllAppointments>}
          ></Route>
          <Route path="/add-doctor" element={<AddDoctor></AddDoctor>}></Route>
          <Route
            path="/doctor-list"
            element={<Doctorslist></Doctorslist>}
          ></Route>
          {/* doctor */}
          <Route
            path="/doctor-dashboard"
            element={<DoctorDashboard></DoctorDashboard>}
          ></Route>
          <Route
            path="/doctor-appointments"
            element={<DoctorAppointments></DoctorAppointments>}
          ></Route>
          <Route
            path="/doctor-profile"
            element={<DoctorProfile></DoctorProfile>}
          ></Route>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login></Login>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default App;
