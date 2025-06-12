import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function UpgradePage() {
  const [plans, setPlans] = useState([])
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { user } = useAuth();
  const [text, setText] = useState('');
  const location = useLocation(); // để lấy location.state
  const [notification, setNotification] = useState('');



 const handleBuy = async (amount) => {
  const accessToken = localStorage.getItem('accessToken');
  let userId = 1;
  if (user) {
    userId = user.userId;
  }

  try {
    const response = await fetch(`http://localhost:8080/payment/getMembershipOfUser`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const inforData = await response.json();

   let confirmed = false;

if (inforData.data) {
  const isOk = window.confirm("Your membership is still active. Are you sure you want to continue?");
  if (!isOk) {
    return;
  }
  confirmed = true;
  setText('Action cancelled.');
} else {
  const confirmBuy = window.confirm("You don't have a membership. Are you sure you want to buy one?");
  if (!confirmBuy) {
    setText('Action cancelled.');
    return;
  }
  confirmed = true;
  setText("Redirecting to payment gateway...");
}

if (confirmed) {
   const paymentResponse = await fetch("http://localhost:8080/payment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ amount, userId }),
    });
    const data = await paymentResponse.json();

    // Chuyển hướng tới url thanh toán
    window.location.href = data.url;

  } 
}catch (error) {
    console.error('Lỗi trong quá trình xử lý:', error);
    setText('Đã xảy ra lỗi, vui lòng thử lại.');
  }

    // Nếu đến đây nghĩa là user đã xác nhận, gọi API thanh toán luôn
   
};
   
  
  useEffect(() => {
    if (location.state?.text) {
      setNotification(location.state.text);
    }
  }, [location.state]);


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8080/payment/getAllMembership', {

          method: 'GET',
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        console.error('Error fetching membership plans:', error)
        // Fallback to default plans (no buttonText, buttonLink)
        setPlans([
          {
            name: '1 month',
            price: '30000',
          },
          {
            name: '6 months',
            price: '60000',
          },
          {
            name: '12 months',
            price: '120000',
          },
        ])
      }
    }

    fetchPlans()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hiển thị thông báo nếu có */}
      {notification && (
        <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
          {notification}
          <button
            className="ml-4 font-bold"
            onClick={() => setNotification('')} // bấm đóng thông báo
          >
            X
          </button>
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take your Japanese learning to the next level with our premium features
          and personalized support.
        </p>
      </motion.div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => {
          const isHovered = hoveredIndex === index

          return (
            <div
              key={plan.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer rounded-lg overflow-hidden transition duration-300 border border-gray-200 shadow-md"
            >
              <div
                className={`p-6 transition-colors duration-300 ${isHovered ? 'bg-yellow-400 text-white' : 'bg-blue-400 text-white'
                  }`}
              >
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price} VND</span>
                  <span className="text-sm ml-2">/{plan.durationInDays} Months</span>
                </div>
              </div>

              <div className="bg-white p-6">
                <button
                  onClick={() => handleBuy(plan.price)}
                  className="mt-6 block w-full text-center py-2 px-4 rounded-md transition-colors duration-200 bg-blue-400 text-white hover:bg-blue-500"
                >
                  Buy now
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UpgradePage
