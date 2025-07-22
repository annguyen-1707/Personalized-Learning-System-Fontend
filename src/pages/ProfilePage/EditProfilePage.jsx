import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    phoneNumber: '',
    email: '',
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.fullName || '',
        dateOfBirth: user.dob || '',
        address: user.address || '',
        gender: user.gender || '',
        phoneNumber: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:8080/api/user/edit", form);
      if (response.status === 200) {
        setSuccess("Profile updated successfully! You will be redirected shortly.");
        setTimeout(() => navigate("/profile"), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data ||
        "Failed to update profile. Please try again later."
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Full Name"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            placeholder="Email"
            readOnly
            disabled
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Phone Number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Address"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <div className="flex items-center gap-4 mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={form.gender === "MALE"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={form.gender === "FEMALE"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="OTHER"
                checked={form.gender === "OTHER"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="btn btn-accent btn-sm"
            onClick={() => navigate("/profile/change-password")}
          >
            Change Password
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary w-full">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;