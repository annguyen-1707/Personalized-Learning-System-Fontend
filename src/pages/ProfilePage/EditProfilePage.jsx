import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfilePage({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(user || {
    fullName: '',
    dob: '',
    address: '',
    // avatar: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:8080/api/user/update-profile", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        dob: form.dob,
        gender: form.gender,
        // avatar: form.avatar, // Nếu backend hỗ trợ
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Failed to update profile"
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
            name="fullName"
            value={form.fullName}
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
            name="phone"
            value={form.phone}
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
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
<div>
          <label className="block font-medium mb-1">Gender</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={() => setForm({ ...form, gender: form.gender === "male" ? "" : "male" })}
                className="checkbox checkbox-primary rounded-full"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={() => setForm({ ...form, gender: form.gender === "female" ? "" : "female" })}
                className="checkbox checkbox-primary rounded-full"
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="gender"
                value="other"
                checked={form.gender === "other"}
                onChange={() => setForm({ ...form, gender: form.gender === "other" ? "" : "other" })}
                className="checkbox checkbox-primary rounded-full"
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
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