import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import ListeningImg from "./components/ListeningImg";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function ListeningPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listeningContents, setListeningContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(Number(localStorage.getItem("content_listening_page")) || 1);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([{ id: "all", name: "All Categories" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJlpt, setSelectedJlpt] = useState("all");

  // JLPT levels data
  const jlptLevels = [
    { id: "all", name: "All Levels" },
    { id: "N5", name: "N5" },
    { id: "N4", name: "N4" },
    { id: "N3", name: "N3" },
    { id: "N2", name: "N2" },
    { id: "N1", name: "N1" }
  ];

  // Handle listening content access
  const handleStartListening = (contentId) => {
    if (user) {
      console.log("User is logged in:", user);
      navigate(`/listening/detail/${contentId}`);
    } else {
      localStorage.setItem("redirectAfterLogin", `/listening/detail/${contentId}`);
      navigate("/login");
    }
  };

  // Fetch categories from backend
  useEffect(() => {
    const getContentListeningCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/content/category/listening");
        const backendCategories = res.data.data.map(cat => ({
          id: cat.toLowerCase(),
          name: cat.charAt(0) + cat.slice(1).toLowerCase()
        }));
        setCategories([{ id: "all", name: "All Categories" }, ...backendCategories]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([{ id: "all", name: "All Categories" }]);
      }
    };
    getContentListeningCategories();
  }, []);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  // Fetch listening contents with filters
  useEffect(() => {
    const fetchListeningContents = async () => {
      setLoading(true);
      try {
        localStorage.setItem("content_listening_page", page);

        const params = {
          page,
          size,
          ...(selectedCategory !== "all" && { category: selectedCategory }),
          ...(searchTerm && { search: searchTerm }),
          ...(selectedJlpt !== "all" && { jlptLevel: selectedJlpt })
        };

        const res = await axios.get(`http://localhost:8080/content_listening/public`, { params });

        const responseData = res.data.data;
        let contents = [];
        let totalPagesValue = 1;

        if (responseData.content) {
          contents = responseData.content;
          totalPagesValue = responseData.totalPages || 1;
        } else if (Array.isArray(responseData)) {
          contents = responseData;
          totalPagesValue = Math.ceil(responseData.length / size);
        }

        setListeningContents(contents);
        setTotalPages(totalPagesValue);
      } catch (err) {
        setError("Cannot connect to backend. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListeningContents();
  }, [page, size, selectedCategory, searchTerm, selectedJlpt]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>
      {error && <div className="mb-4 text-yellow-600">{error}</div>}

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* JLPT Level Filter Bar */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {jlptLevels.map(level => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedJlpt(level.id);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${selectedJlpt === level.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningContents.map((item, idx) => (
          <div key={item.id || idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <ListeningImg
              src={item.image}
              alt={item.title}
              image={item.image}
            />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span
                  onClick={() => {
                    setSelectedCategory(item.category?.toLowerCase() || "all");
                    setPage(1);
                  }}
                  className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer transition-colors"
                >
                  {item.category || "No topic"}
                </span>
                {item.jlptLevel && (
                  <span
                    onClick={() => {
                      setSelectedJlpt(item.jlptLevel);
                      setPage(1);
                    }}
                    className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer transition-colors"
                  >
                    {item.jlptLevel}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold mb-1">{item.title || "No title"}</h2>
              <div className="mt-4">
                <button
                  onClick={() => handleStartListening(item.contentListeningId)}
                  className="block w-full text-center px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600"
                >
                  Start Listening
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
                <ReactPaginate
                    className="pagination mt-6 justify-center"
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPages}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    forcePage={page - 1}
                    renderOnZeroPageCount={null}
                />
    </div>
  );
}

export default ListeningPage;