import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/customixe-axios"; // Adjust the import path as necessary
import { User } from "lucide-react";

function ChangePasswordPage() {
  const useremail = localStorage.getItem("useremail");  
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.current.trim() || !passwords.new.trim() || !passwords.confirm.trim()) {
      setError("All password fields are required.");
      setSuccess("");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match.");
      setSuccess("");
      return;
    }
    if (passwords.new.length < 8) {
      setError("New password must be at least 8 characters long.");
      setSuccess("");
      return;
    }
    if (passwords.current === passwords.new) {
      setError("New password must be different from current password.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:8080/api/user/change-password", {
        // email: useremail,
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      },{ withCredentials: true });
      setSuccess("Password changed successfully! You will be redirected shortly.");
      setTimeout(() => navigate("/profile/edit"), 3000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data && typeof err.response.data === "string") {
        setError(err.response.data);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to change password");
      }
      setSuccess("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Current Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Current Password"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="New Password"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Confirm New Password"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary w-full">
            Change Password
          </button>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => navigate("/profile/edit")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
