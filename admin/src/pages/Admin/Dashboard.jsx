import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);
  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          {/* Doctors Count */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="Doctors Icon" />
            <div>
              <p className="text-2xl font-semibold text-gray-700">
                {dashData.doctors}
              </p>
              <p className="text-gray-500 text-sm">Doctors</p>
            </div>
          </div>

          {/* Appointments Count */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="Appointments Icon"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-700">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-sm">Appointments</p>
            </div>
          </div>

          {/* Patients Count */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.patients_icon}
              alt="Patients Icon"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-700">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white mt-5">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
            <img src={assets.list_icon} alt="List Icon" />
            <p className="font-semibold text-lg text-gray-700">
              Latest Bookings
            </p>
          </div>
          <div className="pt-4 border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                {/* <img
                  src={item.docData.image}
                  alt={`Doctor ${item.docData.name}`}
                  className="w-10 rounded-full"
                /> */}
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  src={item.docData.image}
                  alt={`Doctor ${item.docData.name}`}
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-800">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel Appointment"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
