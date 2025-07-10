import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Phone, Calendar, MapPin, Image } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function RegisterP2() {
  const { register2, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("email");
  const accessToken = localStorage.getItem("accessToken");


  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    address: '',
    // avatar: '',
    gender: '',
    phone: '',
    role: accessToken ? 'USER' : ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.gender) {
      setErrors('Please select all required fields');
      return;
    }
    try {
      setErrors('');
      const error = await register2(
        email,
        formData.fullName,
        formData.dob,
        formData.address,
        formData.gender,
        formData.phone,
        formData.role
      );

      if (error) {
        setErrors(error); // ✅ set lỗi để hiển thị
        return;
      }
      if (!email || !email === "undefined") {
        try {
          const provider = 'FACEBOOK'
          const res = await fetch('http://localhost:8080/auth/getOAuthToken', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, provider }),
            credentials: 'include'
          });

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.message);
          }

          localStorage.setItem("accessToken", data.data.accessToken);

          const userRes = await fetch('http://localhost:8080/auth/user', {
            headers: { Authorization: `Bearer ${data.data.accessToken}` }
          });
          const userData = await userRes.json();
          if (!userRes.status === "OK") {
            throw new Error(userData.message || 'Failed to fetch user data');
          }
          setUser(userData.data);
          const role = userData.data.roleName;
          console.log("ádasddasd", userData.data.parents)
          if (role === "PARENT") {
            navigate("/parentpage");
          } else if (role === "USER") {
            navigate("/");
          }
          else {
            if (!errors || !typeof errors === 'object' || !Object.keys(errors).length > 0) {
              navigate("/admin");
            }

          }

        } catch (error) {
          console.error('Login failed:', error);
          throw error;

        }
        return;
      }
      else {
        navigate('/login', { state: { successMessage: 'Register Successfully' } });
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-primary-600 text-white flex items-center justify-center">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors && typeof errors === 'object' && Object.keys(errors).length > 0 && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <ul className="list-disc list-inside text-sm">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="pl-10 w-full border-gray-300 rounded-md"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="pl-10 w-full border-gray-300 rounded-md"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="pl-10 w-full border-gray-300 rounded-md"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="flex items-center space-x-4 pl-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formData.gender === 'MALE'}
                  onChange={handleChange}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formData.gender === 'FEMALE'}
                  onChange={handleChange}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="OTHER"
                  checked={formData.gender === 'OTHER'}
                  onChange={handleChange}
                />
                <span>Other</span>
              </label>
            </div>



            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="pl-10 w-full border-gray-300 rounded-md"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 pl-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Register for:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="PARENT"
                    checked={formData.role === 'PARENT'}
                    onChange={handleChange}
                    disabled={!!accessToken}
                  />
                  <span>Parent</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    checked={formData.role === 'USER'}
                    onChange={handleChange}
                    disabled={!!accessToken}
                  />
                  <span>Student</span>
                </label>
              </div>
            </div>
            <div>
              <button type="submit" className="w-full btn-primary py-2 px-4">
                Create profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterP2;