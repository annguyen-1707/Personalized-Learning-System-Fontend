import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, MessageSquare, Languages, Search, ShieldX } from 'lucide-react';
import {
    fetchDialoguePage,
    handleCreateDialogue,
    handleDeleteDialogue,
    handleUpdateDialogue
} from '../../services/DialogueService';
import ReactPaginate from 'react-paginate';
import { getJlptLevel, getStatus } from '../../services/ContentListeningService';
import { getContentSpeakingByLever } from '../../services/ContentSpeakingService';
import { toast } from "react-toastify";
import { useAuth } from '../../context/AuthContext';

function DialogueManagement() {
    const [errorMessage, setErrorMessage] = useState("");
    const [dialogues, setDialogues] = useState([]);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [pageCount, setPageCount] = useState(0); // so luong trang page
    const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
    const [size, setSize] = useState(6); // 1trang bn phan tu
    const [totalElements, setTotalElements] = useState(); // tong phan tu
    const [listStatus, setListStatus] = useState([]);
    const [listContentSpeaking, setListContentSpeaking] = useState([]);
    const [listLever, setListLever] = useState([]);
    const [formData, setFormData] = useState({
        questionJp: '',
        questionVn: '',
        answerJp: '',
        answerVn: '',
        contentSpeakingId: ''
    });
    const [formChoose, setFormChoose] = useState({
        jlptLevel: '',
        contentSpeakingId: ''
    })
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
        getListLever();
    }, [size]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            contentSpeakingId: Number(formChoose.contentSpeakingId),
        };
        if (isEditing) {
            try {
                await handleUpdateDialogue(isEditing, updatedFormData);
                await getDialoguePage(currentPage);
                setIsAdding(false);
                setIsEditing(null);
                handleSetNullAll();
                toast.success("Success to update Dialogue.!");
            } catch (error) {
                setErrorMessage(error.message || "Failed to update Dialogue.");
                toast.error("Failed to update Dialogue.!");
            }
        } else {
            try {
                console.log("updatedFormData:", updatedFormData)
                await handleCreateDialogue(updatedFormData);
                await getDialoguePage(1);
                setIsAdding(false);
                setIsEditing(null);
                handleSetNullAll();
                toast.success("Success creating dialogue!");
            } catch (error) {
                console.error("Error creating dialogue:", error);
                toast.error("Error creating dialogue!");
                setErrorMessage(error.message || "Failed to add content Speaking.");
            }
        }
    };

    const getListLever = async () => {
        let res = await getJlptLevel();
        if (res && res.data) {
            setListLever(res.data)
        }
    }

    const getListStatus = async () => {
        let res = await getStatus();
        if (res && res.data) {
            setListStatus(res.data)
        }
    }

    const getListContentLisSpeaking = async (newLever) => {
        let res = await getContentSpeakingByLever(newLever);
        if (res && res.data) {
            setListContentSpeaking(res.data)
        }
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
        console.log("Fetching page", page, "with size", size);
        let res = await fetchDialoguePage(page, size);
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

    const handleSetNullAll = () => {
        setFormChoose({
            jlptLevel: '',
            conetntSpeaking: ''
        });
        setFormData({
            questionJp: '',
            questionVn: '',
            answerJp: '',
            answerVn: '',
            contentSpeakingId: ''
        })
        setErrorMessage("");
    }

    const handleWhenChooseLever = async (newLever) => {
        setFormChoose(prev => ({
            ...prev,
            contentSpeakingId: '',
            jlptLevel: newLever,
        }));
        await getListContentLisSpeaking(newLever);
    }

    const handleWhenChooseContentSpeaking = async (newContent) => {
        setFormChoose(prev => ({
            ...prev,
            contentSpeakingId: newContent,
        }));
    }


    return (
        <div className="animate-fade-in">
            <div className="mb-6">
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
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm flex items-center justify-between">
                            <p className="mb-2">{errorMessage}</p>
                            <button className="text-red-700 hover:text-red-900" onClick={() => setErrorMessage("")}>X</button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question (Japanese)
                                </label>
                                <input
                                    type="text"

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

                                    value={formData.answerVn}
                                    onChange={(e) => setFormData({ ...formData, answerVn: e.target.value })}
                                    className="w-full"
                                    placeholder="Tên tôi là Tanaka."
                                />
                            </div>
                            <>
                                <div>
                                    <label>JLPT Level:</label>
                                    <select
                                        value={formChoose.jlptLevel}
                                        onChange={(e) => handleWhenChooseLever(e.target.value)}
                                        className="border p-2 ml-2"
                                    >
                                        <option value="">-- Select Level --</option>
                                        {listLever.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nếu đã chọn level thì hiển thị chọn content */}
                                {formChoose.jlptLevel && (
                                    <div>
                                        <label>Content Speaking:</label>
                                        <select
                                            value={formChoose.contentSpeakingId}
                                            onChange={(e) => handleWhenChooseContentSpeaking(e.target.value)}
                                            className="border p-2 ml-2"
                                        >
                                            <option value="">-- Select Content --</option>
                                            {listContentSpeaking.map((content) => (
                                                <option key={content.contentSpeakingId} value={content.contentSpeakingId}>{content.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(null);
                                    handleSetNullAll();
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
                <div className="overflow-x-auto">
                    {filteredDialogues?.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Question (JP)</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Question (VN)</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Answer (JP)</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Answer (VN)</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Content Speaking Title</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDialogues.map((dialogue, index) => (
                                    <tr key={dialogue.dialogueId || index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-900">{dialogue.questionJp}</td>
                                        <td className="px-4 py-2 text-gray-700">{dialogue.questionVn}</td>
                                        <td className="px-4 py-2 text-gray-900">{dialogue.answerJp}</td>
                                        <td className="px-4 py-2 text-gray-700">{dialogue.answerVn}</td>
                                        <td className="px-4 py-2 font-medium text-gray-900">
                                            {dialogue?.contentSpeaking?.title}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => startUpdate(dialogue)}
                                                    className="text-primary-600 hover:text-primary-800"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                {showDeleteConfirm === dialogue.dialogueId ? (
                                                    <>
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
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(dialogue.dialogueId)}
                                                        className="text-error-500 hover:text-error-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No dialogues found. Please add a new dialogue.
                        </div>
                    )}
                </div>
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