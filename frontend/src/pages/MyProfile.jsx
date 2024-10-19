import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import axios from "axios";
import "./MyProfile.css";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", tempUserData.name);
      formData.append("phone", tempUserData.phone);
      formData.append("address", JSON.stringify(tempUserData.address));
      formData.append("gender", tempUserData.gender);
      formData.append("dob", tempUserData.dob);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setUserData(tempUserData);
        setIsEdit(false);
        setImage(null);
        window.location.reload();
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setTempUserData({ ...userData });
    setIsEdit(true);
  };

  const handleCancel = () => {
    setTempUserData({ ...userData });
    setIsEdit(false);
    setImage(null);
  };

  return (
    userData && (
      <div className="profile-container">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Profile Image */}
            {isEdit ? (
              <label htmlFor="image">
                <div className="image-upload">
                  <img
                    className="profile-image"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="Profile"
                  />
                  <img
                    className="upload-icon"
                    src={image ? "" : assets.upload_icon}
                    alt="Upload Icon"
                  />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : userData.image ? (
              <img
                className="profile-image"
                src={userData.image}
                alt="Profile"
              />
            ) : (
              <img
                className="profile-image"
                src="path/to/fallback-image.jpg"
                alt="Fallback Profile"
              />
            )}

            {/* User Name */}
            {isEdit ? (
              <input
                className="username-input"
                type="text"
                value={tempUserData.name}
                onChange={(e) =>
                  setTempUserData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            ) : (
              <p className="username-display">{userData.name}</p>
            )}

            <hr className="separator" />

            {/* Contact Information */}
            <p className="contact-title">CONTACT INFORMATION</p>
            <div className="contact-info">
              <p className="info-label">Email id:</p>
              <p className="info-value">{userData.email}</p>
              <p className="info-label">Phone:</p>
              {isEdit ? (
                <input
                  className="phone-input"
                  type="text"
                  value={tempUserData.phone}
                  onChange={(e) =>
                    setTempUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="info-value">{userData.phone}</p>
              )}
              <p className="info-label">Address:</p>
              {isEdit ? (
                <div>
                  <input
                    className="address-input"
                    onChange={(e) =>
                      setTempUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={tempUserData.address.line1}
                    type="text"
                  />
                  <br />
                  <input
                    className="address-input"
                    onChange={(e) =>
                      setTempUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={tempUserData.address.line2}
                    type="text"
                  />
                </div>
              ) : (
                <p className="info-value">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div>
              <p className="basic-info-title">BASIC INFORMATION</p>
              <div className="basic-info">
                <p className="info-label">Gender:</p>
                {isEdit ? (
                  <select
                    className="gender-select"
                    onChange={(e) =>
                      setTempUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={tempUserData.gender}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="info-value">{userData.gender}</p>
                )}
                <p className="info-label">BirthDay:</p>
                {isEdit ? (
                  <input
                    className="dob-input"
                    onChange={(e) =>
                      setTempUserData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    value={tempUserData.dob}
                    type="date"
                  />
                ) : (
                  <p className="info-value">{userData.dob}</p>
                )}
              </div>
            </div>

            {/* Edit/Save and Cancel Buttons */}
            {/* <div className="button-container">
              {isEdit ? (
                <>
                  <button
                    className="save-button"
                    onClick={updateUserProfileData}
                  >
                    Save Information
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
              )}
            </div> */}

            <div className="button-container flex justify-between mt-6">
              {isEdit ? (
                <>
                  <div className="flex-1 mx-1">
                    {" "}
                    {/* Margin to space out buttons */}
                    <button
                      className="save-button w-32 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                      onClick={updateUserProfileData}
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex-1 mx-1">
                    <button
                      className="cancel-button w-32 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 mx-1">
                  <button
                    className="edit-button w-32 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  );
};

export default MyProfile;
