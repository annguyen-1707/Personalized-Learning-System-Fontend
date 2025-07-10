import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/customixe-axios";
import ReactPaginate from "react-paginate";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import { getContentSpeakingCategories, getPageContentSpeaking } from "../../services/ContentSpeakingClientService"; // Import service functions
// Function to get speaking categories from backend


function SpeakingPage() {
    const { user } = useAuth(); // Get user from AuthContext
    const navigate = useNavigate();
    const [speakingContents, setSpeakingContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState([{ id: "all", name: "All Categories" }]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch categories from backend
    useEffect(() => {
        fetchSpeakingContents();
        fetchCategories();
    }, [page, size]);

    // Handle speaking content access
    const handleStartSpeaking = (contentId) => {
        if (user) {
            // User is logged in, navigate to the speaking detail page
            navigate(`/speaking/detail/${contentId}`);
        } else {
            // User is not logged in, redirect to login page
            // Store the intended destination to redirect after login
            localStorage.setItem("redirectAfterLogin", `/speaking/detail/${contentId}`);
            navigate("/login");
        }
    };

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    const fetchCategories = async () => {
        try {
            const res = await getContentSpeakingCategories();
            console.log("Fetched categories:", res);
            const backendCategories = res.data.map(cat => ({
                id: cat.toLowerCase(),
                name: cat.charAt(0) + cat.slice(1).toLowerCase()
            }));
            setCategories([{ id: "all", name: "All Categories" }, ...backendCategories]);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setCategories([{ id: "all", name: "All Categories" }]);
        }
    }
    const fetchSpeakingContents = async () => {
        setLoading(true);
        try {
            const res = await getPageContentSpeaking(page, size);
            console.log("Fetched speaking contents:", res);
            setSpeakingContents(res.data.content);
            setTotalPages(res.data.page.totalPages);
        } catch (err) {
            setError("Cannot connect to backend. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const filteredContents = speakingContents.filter(item => {
        // Only search by title (case insensitive)
        const matchesSearch = searchTerm === "" ||
            (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === "all" ||
            (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Speaking Practice</h1>
            {error && <div className="mb-4 text-yellow-600">{error}</div>}

            {/* Search Bar - Only searches by title */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Category Filter Bar */}
            <div className="mb-6 overflow-x-auto">
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

            {/* Content Grid with modified button */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContents.map((item, idx) => (
                    <div key={item.contentSpeakingId || idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        <img
                            src={`http://localhost:8080/images/content_speaking/${item.image}`}
                            alt="Thumbnail"
                            className="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
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
                                <span className="text-xs text-gray-500">
                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold mb-1">{item.title || "No title"}</h2>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleStartSpeaking(item.contentSpeakingId || "")}
                                    className="block w-full text-center px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Start Speaking
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
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

export default SpeakingPage;