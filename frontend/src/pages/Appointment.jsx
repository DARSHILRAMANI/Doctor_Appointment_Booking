import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../components/Loader";

const Appointment = () => {
  const { docId } = useParams();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const { doctors, currencySymbol, getDoctorsData, token, backendUrl } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(true);
  const getAvailableSlots = async () => {
    setDocSlot([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() >= 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate]?.includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot((prev) => [...prev, timeSlots]);
    }
    setLoading(false);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot before booking.");
      return;
    }

    try {
      const date = docSlot[slotIndex][0]?.datetime;
      if (!date) {
        throw new Error("Selected date is not valid.");
      }

      let day = date.getDate();
      let month = date.getMonth() + 1;
      const slotDate = `${day}_${month}_${date.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to book an appointment. Please try again.");
      console.error("Booking error: ", error);
    }
  };

  useEffect(() => {
    const fetchDocInfo = async () => {
      const docInfo = doctors.find((doc) => doc._id === docId);
      setDocInfo(docInfo);
    };

    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    } else {
      setLoading(false);
    }
  }, [docInfo]);

  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="loader">Loading...</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        docInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Doctor Info */}
              <div className="sm:w-1/3">
                <img
                  className="w-full h-auto rounded-lg shadow-md"
                  src={docInfo.image}
                  alt={`${docInfo.name}`}
                />
              </div>

              {/* Doctor Details */}
              <div className="sm:w-2/3">
                <h2 className="flex items-center gap-2 text-3xl font-semibold text-gray-900">
                  {docInfo.name}
                  <img
                    className="w-6"
                    src={assets.verified_icon}
                    alt="Verified"
                  />
                </h2>

                <div className="flex items-center gap-2 text-md mt-2 text-gray-600">
                  <span>
                    {docInfo.degree} - {docInfo.speciality}
                  </span>
                  <button className="ml-2 py-0.5 px-3 border text-xs rounded-full border-gray-300 hover:bg-gray-200">
                    {docInfo.experience} Years Experience
                  </button>
                </div>

                <div className="mt-4">
                  <p className="flex items-center gap-1 text-md font-medium text-gray-900">
                    About <img src={assets.info_icon} alt="Info" />
                  </p>
                  <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                    {docInfo.about}
                  </p>
                </div>

                <p className="text-lg font-semibold text-gray-700 mt-4">
                  Appointment fee:{" "}
                  <span className="text-gray-900">
                    {currencySymbol}
                    {docInfo.fees}
                  </span>
                </p>

                {/* Booking Slots Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800">
                    Booking slots
                  </h3>
                  <div className="flex gap-4 items-center overflow-x-auto mt-4">
                    {docSlot.length > 0 &&
                      docSlot.map(
                        (item, index) =>
                          item.length > 0 && (
                            <div
                              className={`text-center py-3 px-4 rounded-full cursor-pointer min-w-[64px] transition-all duration-300 ${
                                slotIndex === index
                                  ? "bg-primary text-white"
                                  : "border border-gray-200 hover:bg-gray-100"
                              }`}
                              key={index}
                              onClick={() => setSlotIndex(index)}
                            >
                              <p className="text-sm">
                                {daysOfWeek[item[0].datetime.getDay()]}
                              </p>
                              <p className="text-lg font-semibold">
                                {item[0].datetime.getDate()}
                              </p>
                            </div>
                          )
                      )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 overflow-x-auto">
                    {docSlot.length > 0 &&
                      docSlot[slotIndex]?.map((item, index) => (
                        <p
                          className={`text-sm font-light flex-shrink-0 px-3 py-2 rounded-full cursor-pointer transition-colors duration-300 ${
                            item.time === slotTime
                              ? "bg-primary text-white"
                              : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                          }`}
                          key={index}
                          onClick={() => setSlotTime(item.time)}
                        >
                          {item.time.toLowerCase()}
                        </p>
                      ))}
                  </div>
                  <button
                    onClick={bookAppointment}
                    className="bg-primary text-white text-sm font-semibold px-10 py-3 rounded-full my-6 hover:bg-primary-dark transition duration-300"
                  >
                    Book an appointment
                  </button>
                </div>
              </div>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
          </div>
        )
      )}
    </div>
  );
};

export default Appointment;
