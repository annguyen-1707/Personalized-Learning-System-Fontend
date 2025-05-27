import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, MessageSquare, Languages } from 'lucide-react';
import {
    fetchDialogueByContentSpeakingId,
    handleCreateDialogue,
    handleDeleteDialogue,
    handleUpdateDialogue
} from '../../services/DialogueService';

function DialogueManagement() {
    const [dialogues, setDialogues] = useState([
        {
            id: '1',
            question: 'お名前は何ですか？',
            questionTranslation: 'Tên bạn là gì?',
            answer: '私の名前は田中です。',
            answerTranslation: 'Tên tôi là Tanaka.',
            type: 'introduction'
        }
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        questionTranslation: '',
        answer: '',
        answerTranslation: '',
        type: 'general'
    });
    const { contentSpeakingId } = useParams();
    const dialogueTypes = [
        'general',
        'introduction',
        'personal-info',
        'shopping',
        'restaurant',
        'travel',
        'business'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            setDialogues(dialogues.map(d =>
                d.id === isEditing
                    ? { ...formData, id: isEditing }
                    : d
            ));
            setIsEditing(null);
        } else {
            setDialogues([
                ...dialogues,
                {
                    ...formData,
                    id: Date.now().toString()
                }
            ]);
            setIsAdding(false);
        }

        setFormData({
            question: '',
            questionTranslation: '',
            answer: '',
            answerTranslation: '',
            type: 'general'
        });
    };

    const handleDelete = (id) => {
        setDialogues(dialogues.filter(d => d.id !== id));
        setShowDeleteConfirm(null);
        handleDeleteDialogue(id);
    };

    const startEdit = (dialogue) => {
        setFormData(dialogue);
        setIsEditing(dialogue.id);
        setIsAdding(false);
    };

    const getDialogues = async () => {
        let res = await fetchDialogueByContentSpeakingId(contentSpeakingId);
        if (res && res.data) {
            setDialogues(res.data);
            console.log("Fetched dialogues:", res.data);
        } else {
            console.error("Failed to fetch dialogues");
        }
    }
    useEffect(() => {
        getDialogues();
    }, [contentSpeakingId]);

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
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
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
                                    value={formData.questionTranslation}
                                    onChange={(e) => setFormData({ ...formData, questionTranslation: e.target.value })}
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
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
                                    value={formData.answerTranslation}
                                    onChange={(e) => setFormData({ ...formData, answerTranslation: e.target.value })}
                                    className="w-full"
                                    placeholder="Tên tôi là Tanaka."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dialogue Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full"
                                    required
                                >
                                    {dialogueTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(null);
                                    setFormData({
                                        question: '',
                                        questionTranslation: '',
                                        answer: '',
                                        answerTranslation: '',
                                        type: 'general'
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
            <div className="card">
                <div className="divide-y divide-gray-200">
                    {dialogues.map((dialogue) => (
                        <div key={dialogue.id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
                                        <span className="badge bg-primary-50 text-primary-700">
                                            {dialogue?.contentSpeaking?.category}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Question (Japanese)</p>
                                                <p className="text-gray-900">{dialogue.questiontJp}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Question (Vietnamese)</p>
                                                <p className="text-gray-700">{dialogue.questiontVn}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Answer (Japanese)</p>
                                                <p className="text-gray-900">{dialogue.answerJp}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Answer (Vietnamese)</p>
                                                <p className="text-gray-700">{dialogue.answerVn}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-4 flex items-center">
                                    {showDeleteConfirm === dialogue.id ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">Delete?</span>
                                            <button
                                                onClick={() => handleDelete(dialogue.id)}
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
                                                onClick={() => startEdit(dialogue)}
                                                className="text-primary-600 hover:text-primary-800 mr-2"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(dialogue.id)}
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
            </div>
        </div>
    );
}

export default DialogueManagement;