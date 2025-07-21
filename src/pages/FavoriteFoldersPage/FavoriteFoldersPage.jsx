import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../services/customixe-axios'
import { FiFolder, FiUser, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'

function FavoriteFoldersPage() {
    const navigate = useNavigate()
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)

    const [viewType, setViewType] = useState('mine')
    const [folderType, setFolderType] = useState('all') // <-- default "all"
    const [showAddForm, setShowAddForm] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [newFolderIsPublic, setNewFolderIsPublic] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [editingFolder, setEditingFolder] = useState(null)
    const [editName, setEditName] = useState('')
    const [editIsPublic, setEditIsPublic] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchFolders()
    }, [viewType, folderType, page])

    const handleCopyFolder = async (id) => {
        try {
            await axios.post('http://localhost:8080/favorites/copy', id, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            alert('Copied folder successfully!')
        } catch (error) {
            console.error('Failed to copy folder:', error)
            alert('Failed to copy folder')
        }
    }

    const fetchFolders = async () => {
        setLoading(true)
        try {
            const params = {
                viewType,
                currentPage: page,
                pageSize: 6,
                searchName: searchKeyword.trim() || undefined,
            }
            if (folderType !== 'all') {
                params.type = folderType
            }

            const response = await axios.get('http://localhost:8080/favorites', { params })
            const data = response.data
            setFolders(data.content || [])
            setTotalPages(data.page?.totalPages || 1)
        } catch (error) {
            console.error('Error fetching folders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return alert('Folder name is required')
        setSubmitting(true)
        try {
            await axios.post('http://localhost:8080/favorites', {
                name: newFolderName,
                isPublic: newFolderIsPublic,
                type: folderType === 'all' ? null : folderType,
            })
            setNewFolderName('')
            setNewFolderIsPublic(false)
            setShowAddForm(false)
            fetchFolders()
        } catch (error) {
            console.error('Failed to add folder:', error)
            alert('Failed to create folder')
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateFolder = async () => {
        if (!editingFolder || !editName.trim()) return alert('Folder name is required')
        try {
            await axios.put(`http://localhost:8080/favorites/${editingFolder.id}`, {
                name: editName,
                isPublic: !!editIsPublic,
            })
            fetchFolders()
            setEditingFolder(null)
        } catch (error) {
            console.error('Failed to update folder:', error)
            alert('Update failed')
        }
    }

    const handleDeleteFolder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this folder?')) return
        try {
            await axios.delete(`http://localhost:8080/favorites/${id}`)
            fetchFolders()
        } catch (error) {
            console.error('Failed to delete folder:', error)
            alert('Delete failed')
        }
    }

    const handleSearch = () => {
        setPage(0)
        fetchFolders()
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage)
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                {/* ViewType buttons */}
                <div className="flex gap-2 p-2 bg-gray-100 rounded-xl shadow-sm">
                    <button onClick={() => setViewType('mine')} className={`px-4 py-2 rounded-full font-medium ${viewType === 'mine' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
                        My Folders
                    </button>
                    <button onClick={() => setViewType('public')} className={`px-4 py-2 rounded-full font-medium ${viewType === 'public' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
                        Public
                    </button>
                </div>

                {/* FolderType buttons */}
                <div className="flex gap-2 p-2 bg-gray-100 rounded-xl shadow-sm">
                    <button onClick={() => setFolderType('all')} className={`px-4 py-2 rounded-full font-medium ${folderType === 'all' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                        All
                    </button>
                    <button onClick={() => setFolderType('vocabulary')} className={`px-4 py-2 rounded-full font-medium ${folderType === 'vocabulary' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                        Vocabulary
                    </button>
                    <button onClick={() => setFolderType('grammar')} className={`px-4 py-2 rounded-full font-medium ${folderType === 'grammar' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                        Grammar
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search folders..."
                        className="px-3 py-2 border rounded shadow-sm w-full"
                    />
                    <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">Search</button>
                </div>

                {viewType === 'mine' && (
                    <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-green-500 text-white rounded flex items-center">
                        <FiPlus className="mr-2" /> Add Folder
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="mb-6 bg-gray-50 p-4 rounded shadow">
                    <input
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder Name"
                        className="w-full px-3 py-2 mb-2 border rounded"
                    />
                    <label className="inline-flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={newFolderIsPublic}
                            onChange={(e) => setNewFolderIsPublic(e.target.checked)}
                            className="mr-2"
                        /> Public
                    </label>
                    <div className="mt-2 flex gap-3">
                        <button onClick={handleAddFolder} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onClick={() => {
                                if (editingFolder?.id === folder.id) return
                                navigate(`/favorites/${folder.id}`)
                            }}
                            className="relative bg-white p-4 rounded shadow hover:shadow-md cursor-pointer transition"
                        >
                            {editingFolder?.id === folder.id ? (
                                <div>
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 mb-2 border rounded"
                                    />
                                    <label className="inline-flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            checked={editIsPublic}
                                            onChange={(e) => setEditIsPublic(e.target.checked)}
                                            className="mr-2"
                                        />Public
                                    </label>
                                    <div className="mt-2 flex gap-2">
                                        <button onClick={handleUpdateFolder} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Save</button>
                                        <button onClick={() => setEditingFolder(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 flex items-center truncate">
                                        <FiFolder className="mr-2" /> {folder.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1"><FiUser className="inline mr-1" /> {folder.ownerName}</p>
                                    <p className="text-sm text-gray-500 mb-1">Added on: {new Date(folder.addedAt).toLocaleDateString()}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-700">
                                            📘 {folder.numberOfVocabulary || 0} vocab | 🧠 {folder.numberOfGrammar || 0} grammar
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${folder.public ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {folder.public ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        {viewType === 'mine' && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingFolder(folder)
                                                        setEditName(folder.name)
                                                        setEditIsPublic(!!folder.isPublic)
                                                    }}
                                                    className="text-blue-600 hover:underline text-sm flex items-center"
                                                >
                                                    <FiEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteFolder(folder.id)
                                                    }}
                                                    className="text-red-600 hover:underline text-sm flex items-center"
                                                >
                                                    <FiTrash2 className="mr-1" /> Delete
                                                </button>
                                            </>
                                        )}

                                        {viewType === 'public' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCopyFolder(folder.id)
                                                }}
                                                className="text-green-600 hover:underline text-sm flex items-center"
                                            >
                                                <FiPlus className="mr-1" /> Copy to My Folder
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded border ${page === i ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default FavoriteFoldersPage
