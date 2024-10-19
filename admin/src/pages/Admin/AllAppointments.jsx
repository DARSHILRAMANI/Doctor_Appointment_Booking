// import React, { useContext, useEffect } from "react";
// import { AdminContext } from "../../context/AdminContext";
// import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets";

// const AllAppointments = () => {
//   const { aToken, appointments, getAllAppointments, cancelAppointment } =
//     useContext(AdminContext);
//   const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

//   useEffect(() => {
//     if (aToken) {
//       getAllAppointments();
//     }
//   }, [aToken]);

//   return (
//     <div className="w-full max-w-6xl mx-auto my-5">
//       <p className="mb-3 text-lg font-medium text-gray-800">All Appointments</p>
//       <div className="bg-white border rounded-lg shadow-md text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
//         <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-100">
//           <p>#</p>
//           <p>Patient</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Doctor</p>
//           <p>Fee</p>
//           <p>Actions</p>
//         </div>
//         {appointments.map((item, index) => (
//           <div
//             className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-all duration-150 ease-in"
//             key={index}
//           >
//             <p className="hidden sm:block">{index + 1}</p>
//             <div className="flex items-center gap-3">
//               <img
//                 className="w-8 h-8 rounded-full "
//                 src={item.userData.image}
//                 alt=""
//               />
//               <p className="truncate">{item.userData.name}</p>
//             </div>
//             <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
//             <p>
//               {slotDateFormat(item.slotDate)}, {item.slotTime}
//             </p>
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-8 rounded-full bg-gray-200"
//                 src={item.docData.image}
//                 alt=""
//               />
//               <p>{item.docData.name}</p>
//             </div>
//             <p>
//               {currency}
//               {item.amount}
//             </p>
//             {item.cancelled ? (
//               <p className="text-red-400 text-xs font-medium">cancelled</p>
//             ) : (
//               <img
//                 onClick={() => cancelAppointment(item._id)}
//                 className="w-10 cursor-pointer"
//                 src={assets.cancel_icon}
//                 alt=""
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllAppointments;
import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl mx-auto my-5">
      <p className="mb-3 text-lg font-medium text-gray-800">All Appointments</p>
      <div className="bg-white border rounded-lg shadow-md text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-100">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-all duration-150 ease-in"
            key={item._id} // Changed key to item._id for better uniqueness
          >
            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-3">
              {/* <img
                className="w-8 h-8 rounded-full"
                src={item.userData.image}
                alt={item.userData.name} // Added alt text for better accessibility
              /> */}
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                src={item.userData.image}
                alt={item.userData.name}
              />
              <p className="truncate">{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={item.docData.image}
                alt={item.docData.name} // Added alt text for better accessibility
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)} // Ensure _id is valid
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt="Cancel Appointment" // Added alt text for better accessibility
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
