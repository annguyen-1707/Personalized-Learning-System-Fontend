import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { getDialoguePageByContentSpeakingId, handleDeleteDialogue, getDialoguesEmpty, addDialogueToContentSpeaking, removeDialogueFromContentSpeaking } from '../../services/DialogueService';
import ReactPaginate from 'react-paginate';
import { useAuth } from '../../context/AuthContext';

function DialogueManagement() {
    const [dialogues, setDialogues] = useState([]);
    const [selectedDialogues, setSelectedDialogues] = useState([]);
    const [search, setSearch] = useState('');
    const { contentSpeakingId } = useParams();
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(6);
    const [totalElements, setTotalElements] = useState();
    const { user } = useAuth();

    useEffect(() => {
        fetchSelectedDialogues();
        fetchAvailableDialogues(currentPage);
    }, [size]);

    const fetchSelectedDialogues = async () => {
        const res = await getDialoguePageByContentSpeakingId(currentPage, contentSpeakingId, size);
        if (res?.data?.content) setSelectedDialogues(res.data.content);
    };

    const fetchAvailableDialogues = async (page) => {
        const res = await getDialoguesEmpty(page, size);
        if (res?.data?.content) {
            const filtered = res.data.content.filter(d =>
                d.questionJp?.toLowerCase().includes(search.toLowerCase()) ||
                d.questionVn?.toLowerCase().includes(search.toLowerCase()) ||
                d.answerJp?.toLowerCase().includes(search.toLowerCase()) ||
                d.answerVn?.toLowerCase().includes(search.toLowerCase())
            );
            setDialogues(filtered);
            setPageCount(res.data.page.totalPages);
            setTotalElements(res.data.page.totalElements);
        }
    };

    const handleAdd = async (id) => {
        await addDialogueToContentSpeaking(contentSpeakingId, id);
        fetchSelectedDialogues();
        fetchAvailableDialogues(currentPage);
    };

    const handleRemove = async (id) => {
        await removeDialogueFromContentSpeaking(id);
        fetchSelectedDialogues();
        fetchAvailableDialogues(currentPage);
    };

    const handleChangeSize = (newSize) => setSize(newSize);

    const handlePageClick = (selectedItem) => {
        const selectedPage = selectedItem.selected + 1;
        setCurrentPage(selectedPage);
        fetchAvailableDialogues(selectedPage);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <Link to="/admin/content_speaking" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
                    <ArrowLeft size={16} className="mr-1" /> Back to Speaking Content
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Dialogue Management</h1>
            </div>

            <div className="card p-4 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Dialogues</h2>
                {selectedDialogues.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedDialogues.map((d) => (
                            <div key={d.dialogueId} className="bg-white border rounded p-4 shadow-sm relative">
                                <button onClick={() => handleRemove(d.dialogueId)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                    <Trash2 size={14} />
                                </button>
                                <div className="mb-2 text-sm text-gray-700"><strong>JP Question:</strong> {d.questionJp}</div>
                                <div className="mb-2 text-sm text-gray-700"><strong>VN Question:</strong> {d.questionVn}</div>
                                <div className="mb-2 text-sm text-gray-700"><strong>JP Answer:</strong> {d.answerJp}</div>
                                <div className="text-sm text-gray-700"><strong>VN Answer:</strong> {d.answerVn}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No dialogues selected</p>
                )}
            </div>

            <div className="card p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-2/5">
                        <select
                            className="w-full border border-gray-300 rounded-md py-2 px-2"
                            value={size}
                            onChange={(e) => handleChangeSize(Number(e.target.value))}
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={totalElements}>All</option>
                        </select>
                    </div>
                    <div className="relative w-3/5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search dialogues..."
                            className="pl-10 w-full border border-gray-300 rounded-md py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchAvailableDialogues(1)}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Available Dialogues</h2>
                </div>

                {dialogues.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {dialogues.map((d) => (
                            <div key={d.dialogueId} className="bg-white border rounded p-4 shadow-sm relative">
                                <button
                                    onClick={() => handleAdd(d.dialogueId)}
                                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                                >
                                    <Plus size={12} className="inline-block mr-1" /> Add
                                </button>
                                <div className="mb-2 text-sm text-gray-700"><strong>JP Question:</strong> {d.questionJp}</div>
                                <div className="mb-2 text-sm text-gray-700"><strong>VN Question:</strong> {d.questionVn}</div>
                                <div className="mb-2 text-sm text-gray-700"><strong>JP Answer:</strong> {d.answerJp}</div>
                                <div className="text-sm text-gray-700"><strong>VN Answer:</strong> {d.answerVn}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No available dialogues</p>
                )}
            </div>

            <div className="mt-6">
                {/* Phan trang */}
                <div className='mt-4'>
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3} // giới hạn trang bên trái 1 2 3 .... 99 100
                        marginPagesDisplayed={2} // giới hạn trang bên phải 1 2 3 .... 99 100
                        pageCount={pageCount}
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
            </div>
        </div>
    );
}

export default DialogueManagement;
