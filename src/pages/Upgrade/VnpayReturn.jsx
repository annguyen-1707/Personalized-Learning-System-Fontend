import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function VnpayReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 

  useEffect(() => {
  const query = searchParams.toString();
  console.log("Query parameters:", query);
  fetch(`http://localhost:8080/payment/vnpay-return?${query}`)
    .then(async (res) => {
      const text = await res.text(); // Vì backend trả về String
      navigate("/upgrade", { text: {text} }); // Chuyển hướng về trang nâng cấp
      console.log("Kết quả trả về:", text);
      // Hiển thị kết quả hoặc thông báo thành công/thất bại
    })
    .catch((err) => {
      console.error("Lỗi xác minh thanh toán:", err);
    });
}, [searchParams]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Đang xử lý thanh toán...</h1>
    </div>
  );
}

export default VnpayReturn;