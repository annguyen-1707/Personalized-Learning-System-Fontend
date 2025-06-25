import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

export default function ContentModeration() {
  const {
    fetchVocabulary,
    fetchGrammar,
    approveVocabulary,
    approveGrammar,
    deleteVocabulary,
    deleteGrammar,
  } = useData();

  const [activeTab, setActiveTab] = useState("vocabulary");
  const [pendingVocab, setPendingVocab] = useState([]);
  const [pendingGrammar, setPendingGrammar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPending = async () => {
      try {
        // Fetch all vocabularies and grammars (adjust lessonId/page if needed)
        const vocabData = await fetchVocabulary("", 0);
        setPendingVocab(
          (vocabData?.content || vocabData || []).filter(
            (item) => item.status === "pending"
          )
        );
        const grammarData = await fetchGrammar("", 0);
        setPendingGrammar(
          (grammarData?.content || grammarData || []).filter(
            (item) => item.status === "pending"
          )
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApproveVocab = async (id) => {
    setLoading(true);
    await approveVocabulary(id);
    setPendingVocab((prev) => prev.filter((item) => item.id !== id));
    setLoading(false);
  };

  const handleApproveGrammar = async (id) => {
    setLoading(true);
    await approveGrammar(id);
    setPendingGrammar((prev) => prev.filter((item) => item.id !== id));
    setLoading(false);
  };

  const handleDeleteVocab = async (id) => {
    setLoading(true);
    await deleteVocabulary(id);
    setPendingVocab((prev) => prev.filter((item) => item.id !== id));
    setLoading(false);
  };

  const handleDeleteGrammar = async (id) => {
    setLoading(true);
    await deleteGrammar(id);
    setPendingGrammar((prev) => prev.filter((item) => item.id !== id));
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${
            activeTab === "vocabulary"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("vocabulary")}
        >
          Vocabulary
        </button>
        <button
          className={`ml-4 px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${
            activeTab === "grammar"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("grammar")}
        >
          Grammar
        </button>
      </div>
      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}
      {!loading && activeTab === "vocabulary" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Vocabulary</h2>
          {pendingVocab.length === 0 ? (
            <div className="text-gray-500">No pending vocabulary items.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Word</th>
                  <th className="px-4 py-2 border-b">Translation</th>
                  <th className="px-4 py-2 border-b">Example</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVocab.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{item.word}</td>
                    <td className="px-4 py-2 border-b">{item.translation}</td>
                    <td className="px-4 py-2 border-b">{item.example}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleApproveVocab(item.id)}
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteVocab(item.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {!loading && activeTab === "grammar" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Grammar</h2>
          {pendingGrammar.length === 0 ? (
            <div className="text-gray-500">No pending grammar items.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Explanation</th>
                  <th className="px-4 py-2 border-b">Examples</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingGrammar.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{item.title}</td>
                    <td className="px-4 py-2 border-b">{item.explanation}</td>
                    <td className="px-4 py-2 border-b">
                      {Array.isArray(item.examples)
                        ? item.examples.join(", ")
                        : item.examples}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleApproveGrammar(item.id)}
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteGrammar(item.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
} 