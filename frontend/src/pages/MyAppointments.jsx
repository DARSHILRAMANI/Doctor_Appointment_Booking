import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "./MyAppointments.css";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const displayRazorpay = async (
  amount,
  appointmentId,
  token,
  backendUrl,
  userEmail,
  userName,
  doctorName,
  doctorEmail,
  slotTime,
  slotDate
) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    toast.error("You are offline... Failed to load Razorpay SDK");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZ_KEY,
    currency: "INR",
    amount: amount * 100,
    name: "My Appointments",
    description: `Payment for appointment ID: ${appointmentId}`,
    handler: async function (response) {
      console.log("Razorpay Payment Response:", response);
      toast.success("Payment Successful!");
      toast.info("Payment ID: " + response.razorpay_payment_id);

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/confirm-payment`,
          {
            appointmentId,
            paymentId: response.razorpay_payment_id,
            email: userEmail,
          },
          {
            headers: { token },
          }
        );

        console.log("Confirm Payment Response:", data);
        if (data.success) {
          toast.success("Appointment marked as paid.");

          await sendTextReceipt(
            appointmentId,
            amount,
            response.razorpay_payment_id,
            userName,
            userEmail,
            token,
            backendUrl,
            doctorName,
            doctorEmail,
            slotTime,
            slotDate
          );
          window.location.reload();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(
          "Error during payment confirmation:",
          error.response || error
        );
        toast.error("Something went wrong. Please try again.");
      }
    },
    prefill: {
      name: userName,
    },
    modal: {
      ondismiss: function () {
        toast.info("Payment window closed");
      },
      escape: true,
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Generate a text receipt and send it to the backend
const sendTextReceipt = async (
  appointmentId,
  amount,
  paymentId,
  userName,
  userEmail,
  token,
  backendUrl,
  doctorName,
  doctorEmail,
  slotTime,
  slotDate
) => {
  const receiptText = `
    Payment Receipt
    Appointment ID: ${appointmentId}
    Amount Paid: ₹${amount}
    Payment ID: ${paymentId}
    Name: ${userName}
    Email: ${userEmail}
    Doctor Name: ${doctorName}
    Doctor Email: ${doctorEmail}
    Slot Date: ${slotTime}
    Slot Time: ${slotDate}
  `;

  try {
    const response = await axios.post(
      `${backendUrl}/api/user/send-receipt`,
      {
        receipt: receiptText, // Send the receipt text
        email: userEmail,
      },
      {
        headers: {
          token,
        },
      }
    );
    console.log("Send Receipt Response:", response.data); // Added log
    toast.success("Receipt has been sent to your email.");
  } catch (error) {
    console.error("Error sending receipt:", error);
    toast.error("Failed to send receipt.");
  }
};

const MyAppointments = () => {
  const { backendUrl, token, userData, getDoctorsData } =
    useContext(AppContext); // Get user from context
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      console.log("User Appointments Response:", data); // Added log
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message); // Handle error if any
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message); // Added log
      toast.error("Error fetching appointments: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-appointment`,
          { appointmentId },
          { headers: { token } }
        );
        console.log("Cancel Appointment Response:", data);
        if (data.success) {
          toast.success(data.message);
          await getUserAppointments();
          await getDoctorsData();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error cancelling appointment:", error.message); // Added log
        toast.error("Error cancelling appointment: " + error.message);
      }
    },
    [backendUrl, token, getUserAppointments, getDoctorsData]
  );

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, getUserAppointments]);

  return (
    <div className="appointments-container">
      <h2 className="pb-3 mt-12">My Appointments</h2>
      {loading ? (
        <p className="loading">Loading appointments...</p>
      ) : (
        <div>
          {appointments.map((item, index) => {
            const {
              docData,
              slotDate,
              slotTime,
              amount,
              _id,
              cancelled,
              payment,
              isCompleted,
            } = item;
            return (
              <div className="appointment-card" key={index}>
                <img
                  className="appointment-image"
                  src={docData.image}
                  alt={docData.name}
                />
                <div className="appointment-details">
                  <h3>{docData.name}</h3>
                  <p>{docData.speciality}</p>
                  <p className="text-zinc-700 font-medium mt-1">Address:</p>
                  <p className="text-xs">{docData.address.line1}</p>
                  <p className="text-xs">{docData.address.line2}</p>
                  <p className="appointment-date-time">
                    <span className="text-sm font-medium">Date & Time :</span>
                    {slotDateFormat(slotDate)} | {slotTime}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {!cancelled && !payment && !isCompleted && (
                    <>
                      <button
                        onClick={() =>
                          displayRazorpay(
                            amount,
                            _id,
                            token,
                            backendUrl,
                            userData.email,
                            userData.name,
                            docData.email,
                            docData.name,
                            slotDate,
                            slotTime
                          )
                        }
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                      <button
                        onClick={() => cancelAppointment(_id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-800 hover:text-white transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                  {!cancelled && payment && !isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Payment Completed
                    </button>
                  )}
                  {cancelled && !isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Appointment cancelled
                    </button>
                  )}
                  {isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-primary rounded text-primary">
                      Appointment Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
