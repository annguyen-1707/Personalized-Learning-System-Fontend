import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, MessageSquare, Languages, Search, ShieldX } from 'lucide-react';
import {
    getDialoguePageByContentSpeakingId,
    handleDeleteDialogue,
    inActiveDialogue,
    acceptDialogue,
    rejectDialogue
} from '../../services/DialogueService';
import ReactPaginate from 'react-paginate';
import { useAuth } from '../../context/AuthContext';

function DialogueManagement() {
    const [dialogues, setDialogues] = useState([]);
    const [search, setSearch] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { contentSpeakingId } = useParams();
    const [pageCount, setPageCount] = useState(0); // so luong trang page
    const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
    const [size, setSize] = useState(6); // 1trang bn phan tu
    const [totalElements, setTotalElements] = useState(); // tong phan tu
    const { user } = useAuth();
    const isStaff =
        user &&
        Array.isArray(user.role) &&
        user.role.some(role =>
            ["STAFF"].includes(role)
        );
    const isContentManagerment =
        user &&
        Array.isArray(user.role) &&
        user.role.some(role =>
            ["CONTENT_MANAGER"].includes(role)
        );
    useEffect(() => {
        getDialoguePage(1);
    }, [size]);

    const handleDelete = async (id) => {
        await handleDeleteDialogue(id);
        await getDialoguePage(currentPage);
    };

    const getDialoguePage = async (page) => {
        let res = await getDialoguePageByContentSpeakingId(page, contentSpeakingId, size);
        console.log("Data page", res)
        if (res && res.data && res.data.content) {
            setDialogues(res.data.content);
            setPageCount(res.data.page.totalPages);
            setTotalElements(res.data.page.totalElements)
        } else {
            console.error("Failed to fetch dialogues");
        }
    }

    const handleChangeSize = async (newSize) => {
        setSize(newSize)
    }
    const filteredDialogues = dialogues.filter((dialogue) => {
        // Search filter (case insensitive)
        const searchMatch =
            search === "" ||
            dialogue.questionJp?.toLowerCase().includes(search.toLowerCase()) ||
            dialogue.questionVn?.toLowerCase().includes(search.toLowerCase()) ||
            dialogue.answerJp?.toLowerCase().includes(search.toLowerCase()) ||
            dialogue.answerVn?.toLowerCase().includes(search.toLowerCase());
        return searchMatch;
    });

    const handlePageClick = (event) => {
        const selectedPage = +event.selected + 1;
        setCurrentPage(selectedPage);
        getDialoguePage(selectedPage);
    }

    const handleAccept = async (id) => {
        await acceptDialogue(id);
        await getDialoguePage(currentPage);

    }

    const handleReject = async (id) => {
        await rejectDialogue(id)
        await getDialoguePage(currentPage);
    }

    const handleInActive = async (id) => {
        await inActiveDialogue(id);
        await getDialoguePage(currentPage);
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <Link to="/admin/content_speaking" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Speaking Content
                </Link>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dialogue Management</h1>
                        <p className="text-gray-500 mt-1">Manage dialogue pairs for speaking practice</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-1/5">
                        <select
                            className="w-full border border-gray-300 rounded-md py-2 px-2"
                            value={size}
                            onChange={(e) => handleChangeSize(e.target.value)
                            }
                        >
                            <option value="6">6</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="60">60</option>
                            <option value={totalElements} >All </option>
                        </select>
                    </div>
                    <div className="relative w-4/5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search speaking content..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Dialogues List */}
            <div className="card mb-4">
                {filteredDialogues?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredDialogues.map((dialogue, index) => (
                            <div key={dialogue.dialogueId || index} className="p-6 border rounded-lg shadow hover:bg-gray-50">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        {/* Category badge */}
                                        <div className="flex items-center">
                                            <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
                                            <span className="badge bg-primary-50 text-primary-700">
                                                {dialogue?.contentSpeaking?.category}
                                            </span>
                                        </div>

                                        {/* Status badge */}
                                        <span
                                            className={`text-xs px-2 py-1 rounded font-medium ${dialogue.status === "PUBLIC"
                                                ? "bg-green-100 text-green-700"
                                                : dialogue.status === "REJECT"
                                                    ? "bg-red-100 text-red-700"
                                                    : dialogue.status === "IN_ACTIVE"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {dialogue.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 flex-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Question (Japanese)</p>
                                            <p className="text-gray-900">{dialogue.questionJp}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Question (Vietnamese)</p>
                                            <p className="text-gray-700">{dialogue.questionVn}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Answer (Japanese)</p>
                                            <p className="text-gray-900">{dialogue.answerJp}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Answer (Vietnamese)</p>
                                            <p className="text-gray-700">{dialogue.answerVn}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex justify-end pt-4">
                                        {showDeleteConfirm === dialogue.dialogueId ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-500">Delete?</span>
                                                <button
                                                    onClick={() => handleDelete(dialogue.dialogueId)}
                                                    className="text-error-500 hover:text-error-700"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {isContentManagerment && dialogue.status === "DRAFT" && (
                                                    <div className="flex gap-3 mt-2">
                                                        <button
                                                            onClick={() => handleAccept(dialogue.dialogueId)}
                                                            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-1 py-1 rounded"
                                                        >
                                                            <Check size={16} className="mr-1" />
                                                            Accept
                                                        </button>

                                                        <button
                                                            onClick={() => handleReject(dialogue.dialogueId)}
                                                            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded"
                                                        >
                                                            <X size={16} className="mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {isContentManagerment && dialogue.status === "PUBLIC" && (
                                                    <div className="flex gap-4 mt-2">
                                                        <button
                                                            onClick={() => handleInActive(dialogue.dialogueId)}
                                                            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-1 py-1 rounded"
                                                        >
                                                            <ShieldX size={16} className="mr-1" />
                                                            In Active
                                                        </button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setShowDeleteConfirm(dialogue.dialogueId)}
                                                    className="text-error-500 hover:text-error-700 ml-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p>No dialogues found. Please add a new dialogue.</p>
                    </div>
                )}
            </div>

            {/* Phan trang */}
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
    );
}
export default DialogueManagement;