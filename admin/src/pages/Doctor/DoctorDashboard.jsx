import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
  } = useContext(DoctorContext);

  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          {/* Earnings */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.earning_icon}
              alt="Earnings Icon"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {currency}
                {dashData.earnings}
              </p>
              <p className="text-sm text-gray-500">Earnings</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="Appointments Icon"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.patients_icon}
              alt="Patients Icon"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-sm text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white mt-5">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
            <img src={assets.list_icon} alt="List Icon" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                {/* <img
                  src={item.userData.image}
                  alt={`Doctor ${item.userData.name}`}
                  className="w-10 rounded-full"
                /> */}
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  src={item.docData.image}
                  alt={`Doctor ${item.docData.name}`}
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-800">
                    {item.userData.name}
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
                  <div className="flex items-center gap-3">
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-8 cursor-pointer hover:opacity-80 transition duration-200"
                      src={assets.tick_icon}
                      alt="Confirm"
                    />
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-8 cursor-pointer hover:opacity-80 transition duration-200"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
