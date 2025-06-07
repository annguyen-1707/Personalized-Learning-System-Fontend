import { Link } from "react-router-dom";

const listeningContents = [
  {
    id: 1,
    title: "Daily Conversation",
    description: "Practice listening to daily Japanese conversations with native speakers.",
    level: "Beginner",
    progress: 40,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Travel Situations",
    description: "Understand Japanese in real travel scenarios: airport, hotel, restaurant, and more.",
    level: "Intermediate",
    progress: 10,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "JLPT Listening N5",
    description: "Prepare for JLPT N5 listening with sample tests and explanations.",
    level: "Beginner",
    progress: 0,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  // Thêm các bài nghe khác nếu muốn
];

function ListeningListPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningContents.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.level === "Beginner" ? "bg-green-100 text-green-700" : item.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                  {item.level}
                </span>
                <span className="text-xs text-gray-500">{item.progress}%</span>
              </div>
              <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
              <p className="text-gray-600 text-sm flex-1">{item.description}</p>
              <div className="mt-4">
                <Link
                  to={`/listening/${item.id}`}
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