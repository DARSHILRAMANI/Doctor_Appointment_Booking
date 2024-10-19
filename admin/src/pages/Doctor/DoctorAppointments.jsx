// import React, { useContext, useEffect } from "react";
// import { DoctorContext } from "../../context/DoctorContext";
// import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets";

// const DoctorAppointments = () => {
//   const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
//   const { appointments, dToken, getAppointments } = useContext(DoctorContext);

//   useEffect(() => {
//     if (dToken) {
//       getAppointments();
//     }
//   }, [dToken]);

//   if (!appointments) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="w-full max-w-6xl m-5">
//       <p className="mb-3 text-lg font-medium">All Appointments</p>
//       <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
//         <div className="max:sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
//           <p>#</p>
//           <p>Patient</p>
//           <p>Payment</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>
//         {appointments.map((item, index) => (
//           <div
//             className="flex flex-wrap justify-between max:sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
//             key={item.id} // Assuming each appointment has a unique ID
//           >
//             <p className="max-sm:hidden">{index + 1}</p>
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-8 rounded-full"
//                 src={item.userData.image}
//                 alt=""
//               />
//               <p>{item.userData.name}</p>
//             </div>
//             <div className="text-xs inline border border-primary w-auto px-2 rounded-full">
//               <p>{item.payment ? "Online" : "CASH"}</p>
//             </div>
//             <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
//             <p>
//               {slotDateFormat(item.slotDate)}, {item.slotTime}
//             </p>
//             <p>
//               {currency}
//               {item.amount}
//             </p>
//             <div className="flex">
//               <img
//                 className="w-10 cursor-pointer"
//                 src={assets.tick_icon}
//                 alt=""
//               />
//               <img
//                 className="w-10 cursor-pointer"
//                 src={assets.cancel_icon}
//                 alt=""
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorAppointments;

import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-lg font-semibold text-gray-800">
        All Appointments
      </p>
      <div className="bg-white border rounded-md shadow-lg text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-3 px-6 bg-gray-100 border-b text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointment Items */}
        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 items-center py-3 px-6 border-b hover:bg-gray-50 transition duration-200 ease-in-out"
            key={index}
          >
            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-3">
              {/* <img
                className="w-10 h-10 rounded-full object-cover"
                src={item.userData.image}
                alt="Patient"
              /> */}
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                src={item.userData.image}
                alt="profile"
              />
              <p className="font-medium text-gray-700">{item.userData.name}</p>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full text-center border ${
                item.payment
                  ? "border-green-500 text-green-500"
                  : "border-red-500 text-red-500"
              }`}
            >
              <p>{item.payment ? "Online" : "CASH"}</p>
            </div>
            <p className="hidden sm:block text-gray-600">
              {calculateAge(item.userData.dob)}
            </p>
            <p className="text-gray-600">
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p className="text-gray-700">
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
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
  );
};

export default DoctorAppointments;
