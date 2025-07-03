import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, MessageSquare, Languages, Search } from 'lucide-react';
import {
    getDialoguePageByContentSpeakingId,
    handleCreateDialogue,
    handleDeleteDialogue,
    handleUpdateDialogue
} from '../../services/DialogueService';
import ReactPaginate from 'react-paginate';

function DialogueManagement() {
    const [dialogues, setDialogues] = useState([]);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { contentSpeakingId } = useParams();
    const [pageCount, setPageCount] = useState(0); // so luong trang page
    const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
    const [size, setSize] = useState(6); // 1trang bn phan tu
    const [totalElements, setTotalElements] = useState(); // tong phan tu
    const [formData, setFormData] = useState({
        questionJp: '',
        questionVn: '',
        answerJp: '',
        answerVn: '',
        contentSpeakingId: contentSpeakingId
    });
    useEffect(() => {
        getDialoguePage(1);
    }, [size]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await handleUpdateDialogue(isEditing, formData);
                await getDialoguePage(currentPage);
                setIsAdding(false);
                setIsEditing(null);
            } catch (error) {
                console.error("Error updating dialogue:", error);
            }
        } else {
            try {
                await handleCreateDialogue(formData);
                await getDialoguePage(1);
                setIsAdding(false);
                setIsEditing(null);
            } catch (error) {
                console.error("Error creating dialogue:", error);
                if (error.response && error.response.data) {
                    alert(error.response.data.message || "Failed to create dialogue");
                } else {
                    alert("An unexpected error occurred");
                }
            }
        }
        setFormData({
            questionJp: '',
            questionVn: '',
            answerJp: '',
            answerVn: '',
            contentSpeakingId: contentSpeakingId
        });
    };

    const getAll = async() => {
        
    }

    const handleDelete = async (id) => {
        await handleDeleteDialogue(id);
        await getDialoguePage(currentPage);
    };

    const startUpdate = (dialogue) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setFormData(dialogue);
        setIsEditing(dialogue.dialogueId);
        setIsAdding(false);
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
                    <button
                        onClick={() => { setIsAdding(true); setIsEditing(null); }}
                        className="btn-primary flex items-center"
                        disabled={isAdding || isEditing}
                    >
                        <Plus size={16} className="mr-1" />
                        Add Dialogue
                    </button>
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


            {/* Add/Edit Form */}
            {(isAdding || isEditing) && (
                <div className="card p-6 mb-6">
                    <h2 className="text-xl font-medium mb-4">
                        {isAdding ? 'Add New Dialogue' : 'Edit Dialogue'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question (Japanese)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.questionJp}
                                    onChange={(e) => setFormData({ ...formData, questionJp: e.target.value })}
                                    className="w-full"
                                    placeholder="お名前は何ですか？"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question (Vietnamese)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.questionVn}
                                    onChange={(e) => setFormData({ ...formData, questionVn: e.target.value })}
                                    className="w-full"
                                    placeholder="Tên bạn là gì?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer (Japanese)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.answerJp}
                                    onChange={(e) => setFormData({ ...formData, answerJp: e.target.value })}
                                    className="w-full"
                                    placeholder="私の名前は田中です。"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer (Vietnamese)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.answerVn}
                                    onChange={(e) => setFormData({ ...formData, answerVn: e.target.value })}
                                    className="w-full"
                                    placeholder="Tên tôi là Tanaka."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(null);
                                    setFormData({
                                        questionJp: '',
                                        questionVn: '',
                                        answerJp: '',
                                        answerVn: '',
                                        contentSpeakingId: contentSpeakingId
                                    });
                                }}
                                className="btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                {isAdding ? 'Add Dialogue' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Dialogues List */}
            <div className="card mb-4">
                {filteredDialogues?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredDialogues.map((dialogue, index) => (
                            <div key={dialogue.dialogueId || index} className="p-6 border rounded-lg shadow hover:bg-gray-50">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center mb-4">
                                        <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
                                        <span className="badge bg-primary-50 text-primary-700">
                                            {dialogue?.contentSpeaking?.category}
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
                                                <button
                                                    onClick={() => startUpdate(dialogue)}
                                                    className="text-primary-600 hover:text-primary-800 mr-2"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(dialogue.dialogueId)}
                                                    className="text-error-500 hover:text-error-700"
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