import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, backendUrl, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full overflow-hidden p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-64">
              <img
                className="rounded-lg shadow-md object-cover w-full"
                src={profileData.image}
                alt="Doctor's profile"
              />
            </div>
            <div className="flex-1 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-inner">
              <h1 className="text-4xl font-bold text-gray-800">
                {profileData.name}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                {profileData.experience} years experience
              </button>

              <div className="mt-6">
                <h2 className="text-xl font-medium text-gray-700">About:</h2>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-prose">
                  {profileData.about}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-700">
                  Appointment Fee:{" "}
                  <span className="text-gray-900">
                    {currency}{" "}
                    {isEdit ? (
                      <input
                        type="number"
                        value={profileData.fees}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            fees: e.target.value,
                          }))
                        }
                        className="border p-1 rounded"
                      />
                    ) : (
                      profileData.fees
                    )}
                  </span>
                </p>
              </div>

              <div className="mt-4 text-gray-600">
                <h3 className="font-semibold">Address:</h3>
                <p className="text-sm mt-1">
                  {isEdit ? (
                    <>
                      <input
                        value={profileData.address.line1}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              line1: e.target.value,
                            },
                          }))
                        }
                        type="text"
                        className="border p-1 rounded mb-2"
                      />
                      <br />
                      <input
                        value={profileData.address.line2}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              line2: e.target.value,
                            },
                          }))
                        }
                        type="text"
                        className="border p-1 rounded"
                      />
                    </>
                  ) : (
                    <>
                      {profileData.address.line1}
                      <br />
                      {profileData.address.line2}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  onChange={() =>
                    isEdit &&
                    setProfileData((prev) => ({
                      ...prev,
                      available: !prev.available, // Use prev.available
                    }))
                  }
                  checked={profileData.available}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="available" className="text-gray-600">
                  Available
                </label>
              </div>

              <div className="flex gap-4">
                {isEdit ? (
                  <button
                    onClick={() => {
                      updateProfile(); // Call the updateProfile function
                    }}
                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all shadow-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
