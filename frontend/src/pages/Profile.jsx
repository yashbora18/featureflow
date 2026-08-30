import {
  FiUser,
  FiMail,
  FiShield,
  FiArrowLeft,
  FiCamera,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [name, setName] = useState(
    user?.username || user?.name || ""
  );

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );

  const email = user?.email || "";
  const role = user?.role || "Feature Manager";

  /* =====================================================
     PROFILE PICTURE
  ===================================================== */

  const handleProfilePicture = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture must be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture("");
    toast.info("Profile picture removed");
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = () => {
    const updatedUser = {
      ...user,
      username: name,
      profilePicture: profilePicture,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    toast.success("Profile updated successfully");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="profile-header">

          <div className="profile-avatar-edit">

            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="large-profile-avatar">
                <FiUser size={42} />
              </div>
            )}

            {/* CAMERA BUTTON */}

            <label
              htmlFor="profile-picture-upload"
              className="profile-camera-button"
              title="Change profile picture"
            >
              <FiCamera size={17} />
            </label>

            <input
              id="profile-picture-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleProfilePicture}
              hidden
            />

          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your FeatureFlow account information.
            </p>

            <div className="profile-picture-actions">

              <label
                htmlFor="profile-picture-upload"
                className="change-picture-button"
              >
                <FiCamera />
                Change Picture
              </label>

              {profilePicture && (
                <button
                  type="button"
                  className="remove-picture-button"
                  onClick={removeProfilePicture}
                >
                  <FiTrash2 />
                  Remove
                </button>
              )}

            </div>
          </div>

        </div>

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="profile-card-page">

          <div className="profile-section">

            <h2>Personal Information</h2>

            {/* NAME */}

            <div className="profile-field">

              <label>Name</label>

              <div className="input-wrapper">

                <FiUser />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-field">

              <label>Email Address</label>

              <div className="input-wrapper disabled">

                <FiMail />

                <input
                  type="email"
                  value={email}
                  disabled
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="profile-field">

              <label>Role</label>

              <div className="input-wrapper disabled">

                <FiShield />

                <input
                  type="text"
                  value={role}
                  disabled
                />

              </div>

            </div>

            {/* SAVE */}

            <button
              type="button"
              className="save-profile-button"
              onClick={handleSave}
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;