import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    email: "",
    phone: "",
    addressLine: "",
    // city: "",
    // region: "",
  };

  const [form, setForm] = useState(storedUser);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Full Name is required.");
      return;
    }
    setError("");

    if (showPasswordFields && (passwords.new || passwords.confirm || passwords.current)) {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        setPasswordError("Please fill in all password fields.");
        return;
      }
      if (passwords.new !== passwords.confirm) {
        setPasswordError("New passwords do not match.");
        return;
      }
      setPasswordError("");
      alert("Password changed successfully! (Demo only)");
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
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Phone Number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address Line</label>
          <input
            type="text"
            name="addressLine"
            value={form.addressLine}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Address Line"
          />
        </div>
        {/* <div>
          <label className="block font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="City"
          />
        </div> */}
        {/* <div>
          <label className="block font-medium mb-1">Region</label>
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Region"
          />
        </div> */}

        {/* Change Password Button and Section */}
<div className="pt-6 border-t border-gray-200">
  <div className="flex justify-end">
    <button
      type="button"
      className="btn border border-gray-300 bg-white text-black hover:bg-gray-100"
      onClick={() => navigate("/profile/change-password")}
    >
      Change Password
    </button>
  </div>
</div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
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