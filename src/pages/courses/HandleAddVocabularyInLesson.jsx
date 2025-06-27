import { useEffect, useState } from "react";
import { getPageAllVocabulary, addVocabularyInLesson } from "../../services/ContentBankService";
import ReactPaginate from "react-paginate";
import { Plus, Check, X } from "lucide-react"; // hoặc icon của bạn
import { s } from "framer-motion/client";
import { toast } from "react-toastify";

const jlptLevelClassMap = {
  N5: "bg-green-100 text-green-600",
  N4: "bg-yellow-100 text-yellow-600",
  N3: "bg-blue-100 text-blue-600",
  N2: "bg-purple-100 text-purple-600",
  N1: "bg-red-100 text-red-600",
};

const HandleAddVocabularyInLesson = ({ vocabularies, lessonId }) => {
  const [vocabBank, setVocabBank] = useState([]);
  const [lessonVocabs, setLessonVocabs] = useState([...vocabularies]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchVocabBank = async (page) => {
    try {
      const response = await getPageAllVocabulary(page, 5);
      setVocabBank(response?.content);
      setTotalPages(response?.page?.totalPages);
    } catch (error) {
      console.error("Error fetching vocabulary bank:", error);
    }
  };

  useEffect(() => {
    fetchVocabBank(currentPage);
  }, [currentPage]);

  const handleAdd = (vocab) => {
    try {
       addVocabularyInLesson(lessonId, vocab.vocabularyId);
       toast.success("Vocabulary added to lesson successfully!");
       setLessonVocabs([...lessonVocabs, vocab]);
    } catch (error) {
      console.error("Error adding vocabulary:", error);
      toast.error("Failed to add vocabulary." + error?.message);
      return;
    }
  };

   const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };


  return (
    <div className="p-6">

      <div className="overflow-x-auto shadow border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kanji
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kana / Romaji
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meaning
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part of Speech
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                JLPT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Example
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
            {vocabBank
              .filter(
                (item) =>
                  !lessonVocabs.find(
                    (v) => v.vocabularyId === item.vocabularyId
                  )
              )
              .map((item) => (
                <tr key={item.vocabularyId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    {item.kanji}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <div>
                      <strong>Kana:</strong> {item.kana}
                    </div>
                    <div>
                      <strong>Romaji:</strong> {item.romaji}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {item.meaning}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {item.partOfSpeech}
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
                  <td className="px-4 py-2 text-sm italic text-gray-600">
                    {item.example || <span className="text-gray-400">N/A</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-400">
                    {new Date(item.updatedAt).toLocaleString()}
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
    </div>
  );
};

export default HandleAddVocabularyInLesson;
