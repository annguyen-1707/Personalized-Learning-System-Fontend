import { useEffect, useState } from "react";
import { fetchAllGrammar } from "../../services/ContentBankService";
import { Plus } from "lucide-react";
import ReactPaginate from "react-paginate";
import { p } from "framer-motion/client";

const jlptLevelClassMap = {
  N5: "bg-green-100 text-green-600",
  N4: "bg-yellow-100 text-yellow-600",
  N3: "bg-blue-100 text-blue-600",
  N2: "bg-purple-100 text-purple-600",
  N1: "bg-red-100 text-red-600",
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const HandleAddGrammarInLesson = ({ grammars, lessonId }) => {
  const [grammarBank, setGrammarBank] = useState([]);
  const [lessonGrammars, setLessonGrammars] = useState([...grammars]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getGrammarBank = async (page) => {
    try {
      const response = await fetchAllGrammar(page, 5);
      console.log("Grammar Bank Response:", response);
      setGrammarBank(response?.content);
      setTotalPages(response?.page?.totalPages);
    } catch (error) {
      console.error("Error fetching grammar bank:", error);
    }
  };

  useEffect(() => {
    getGrammarBank(currentPage);
  }, [currentPage]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const handleAdd = (grammar) => {
    const exists = lessonGrammars.find(
      (g) => g.grammarId === grammar.grammarId
    );
    if (exists) {
      return;
    }
    setLessonGrammars([...lessonGrammars, grammar]);
  };

  const filteredGrammars = grammarBank.filter(
    (item) => !lessonGrammars.some((g) => g.grammarId === item.grammarId)
  );

  return (
    <div className="p-6">
      {filteredGrammars.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Structure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meaning
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Example
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    JLPT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 animate-fade-in">
                {grammarBank.map((item) => (
                  <tr key={item.grammarId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-gray-800">
                      {item.titleJp}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.structure}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.meaning}
                    </td>
                    <td className="px-4 py-2 text-sm italic text-gray-600">
                      {item.example || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {item.usage}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          jlptLevelClassMap[item.jlptLevel] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.jlptLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-400">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleAdd(item)}
                        className="p-1 rounded-full text-primary-600 hover:text-primary-800"
                      >
                        <Plus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            renderOnZeroPageCount={null}
          />
        </>
      ) : (
        <div className="text-gray-500 mt-6 text-center">
          <p>
            All available grammar points have already been added to this lesson.
          </p>
        </div>
      )}
    </div>
  );
};

export default HandleAddGrammarInLesson;
