import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ListeningListPage() {
  const [listeningContents, setListeningContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListeningContents = async () => {
      try {
        const page = localStorage.getItem("content_listening_page") || 1;
        const size = localStorage.getItem("content_listening_size") || 5;
        const res = await axios.get(`http://localhost:8080/content_listening?page=${page}&size=${size}`);
        setListeningContents(res.data.data.content);
      } catch (err) {
        setError("Cannot connect to backend. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchListeningContents();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>
      {error && <div className="mb-4 text-yellow-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningContents.map((item, idx) => (
          <div key={item.contentListeningId || idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                  {item.topic}
                </span>
              </div>
              <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
              <p className="text-gray-600 text-sm flex-1">{item.description}</p>
              <div className="mt-4">
                <Link
                  to={`/listening/detail/${item.contentListeningId}`}
                  className="block w-full text-center px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600"
                >
                  Start Listening
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeningListPage;