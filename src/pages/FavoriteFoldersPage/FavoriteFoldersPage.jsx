import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiFolder, FiUser, FiPlus } from 'react-icons/fi'

function FavoriteFoldersPage() {
    const { type } = useParams()
    const navigate = useNavigate()
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)

    const [viewType, setViewType] = useState('private')

    const [showAddForm, setShowAddForm] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [newFolderIsPublic, setNewFolderIsPublic] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [searchKeyword, setSearchKeyword] = useState('')
    const [editingFolder, setEditingFolder] = useState(null)
    const [editName, setEditName] = useState('')
    const [editIsPublic, setEditIsPublic] = useState(false)

    useEffect(() => {
        if (!['vocabulary', 'grammar'].includes(type)) {
            navigate('/favorites/vocabulary', { replace: true })
        }
    }, [type, navigate])

    useEffect(() => {
        if (!type) return
        fetchFolders()
    }, [type, viewType])

    const fetchFolders = async () => {
        setLoading(true)
        try {
            let endpoint = ''
            let params = {}

            if (viewType === 'private') {
                endpoint =
                    type === 'grammar'
                        ? 'http://localhost:8080/favorites/grammarfolders'
                        : 'http://localhost:8080/favorites/vocabularyfolders'
            } else {
                endpoint = 'http://localhost:8080/favorites/publicfolders'
                params = { type }
            }

            const response = await axios.get(endpoint, { params })
            const data = response.data.data

            setFolders(data || [])
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
            const response = await axios.post('http://localhost:8080/favorites/folders', {
                name: newFolderName,
                isPublic: newFolderIsPublic,
                type: type,
            })

            setFolders((prev) => [...prev, response.data.data])
            setNewFolderName('')
            setNewFolderIsPublic(false)
            setShowAddForm(false)
        } catch (error) {
            console.error('Failed to add folder:', error)
            alert('Failed to create folder')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSearch = async () => {
        if (!type || !['vocabulary', 'grammar'].includes(type)) return

        if (searchKeyword.trim() === '') {
            fetchFolders()
        } else {
            try {
                let endpoint = ''
                let params = {
                    keyword: searchKeyword.trim(),
                    type,
                }

                if (viewType === 'public') {
                    endpoint = 'http://localhost:8080/favorites/publicfolders/search'
                } else {
                    endpoint = 'http://localhost:8080/favorites/folders/search'
                }

                const response = await axios.get(endpoint, { params })
                setFolders(response.data.data || [])
            } catch (error) {
                console.error('Search failed:', error)
                alert('Search failed')
            }
        }
    }


    const handleUpdateFolder = async () => {
        if (!editingFolder || !editName.trim()) return alert('Folder name is required')

        try {
            await axios.put(`http://localhost:8080/favorites/folders/${editingFolder.id}`, {
                name: editName,
                isPublic: editIsPublic,
            }, {
                params: { type },
            })

            setFolders(prev =>
                prev.map(f =>
                    f.id === editingFolder.id ? { ...f, name: editName, public: editIsPublic } : f
                )
            )
            setEditingFolder(null)
        } catch (error) {
            console.error('Failed to update folder:', error)
            alert('Update failed')
        }
    }

    const handleDeleteFolder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this folder?')) return
        try {
            await axios.delete(`http://localhost:8080/favorites/folders/${id}`, {
                params: { type },
            })
            setFolders(prev => prev.filter(f => f.id !== id))
        } catch (error) {
            console.error('Failed to delete folder:', error)
            alert('Delete failed')
        }
    }

    const handleCopyFolder = async (folderId) => {
        if (!window.confirm('Do you want to copy this folder to your list?')) return
        try {
            const response = await axios.post('http://localhost:8080/favorites/folders/copy', {
                folderId,
                type,
            })
            alert('Folder copied successfully!')
        } catch (error) {
            console.error('Failed to copy folder:', error)
            alert('Copy failed')
        }
    }

    const isOwnFolder = viewType === 'private'

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Toggle Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                {['vocabulary', 'grammar'].map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setViewType('private')
                            navigate(`/favorites/${t}`)
                        }}
                        className={`px-4 py-2 rounded shadow text-sm font-medium ${type === t && viewType === 'private'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
                {['vocabulary', 'grammar'].map((t) => (
                    <button
                        key={t + '-public'}
                        onClick={() => {
                            setViewType('public')
                            navigate(`/favorites/${t}`)
                        }}
                        className={`px-4 py-2 rounded shadow text-sm font-medium ${type === t && viewType === 'public'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Public {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900 mb-4"
            >
                {viewType === 'public' ? 'Public' : 'Your'} {type === 'grammar' ? 'Grammar' : 'Vocabulary'} Folders
            </motion.h1>


            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {viewType === 'private' && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" /> Add Folder
                    </button>
                )}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full sm:w-64 px-3 py-2 border rounded shadow-sm"
                        placeholder={`Search ${viewType === 'public' ? 'public' : ''} folders...`}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="mb-8 bg-gray-50 p-4 rounded shadow">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">Folder Name</label>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={newFolderIsPublic}
                                onChange={(e) => setNewFolderIsPublic(e.target.checked)}
                                className="mr-2"
                            />
                            Public
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddFolder}
                            disabled={submitting}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {submitting ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Folder List */}
            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : folders.length === 0 ? (
                <div className="text-center text-gray-500">No folders found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map((folder, index) => (
                        <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            {editingFolder?.id === folder.id ? (
                                <div>
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 mb-2 border rounded"
                                    />
                                    <label className="inline-flex items-center space-x-2 text-sm text-gray-700 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={editIsPublic}
                                            onChange={(e) => setEditIsPublic(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span>Public</span>
                                    </label>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateFolder}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingFolder(null)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        if (viewType === 'private') {
                                            const path = type === 'grammar'
                                                ? `/grammars/favorite/${folder.id}`
                                                : `/vocabularies/favorite/${folder.id}`
                                            navigate(path)
                                        }
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-semibold flex items-center">
                                            <FiFolder className="mr-2 text-primary-500" /> {folder.name}
                                        </h2>
                                        {folder.public && (
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                Public
                                            </span>
                                        )}
                                        {viewType === 'public' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCopyFolder(folder.id)
                                                }}
                                                className="text-xs text-blue-600 underline ml-2"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        <FiUser className="inline mr-1" /> {folder.ownerName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Added on: {new Date(folder.addedAt).toLocaleDateString()}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700">
                                        {folder.numberOfFavorites} item{folder.numberOfFavorites !== 1 && 's'}
                                    </div>
                                    {isOwnFolder && (
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingFolder(folder)
                                                    setEditName(folder.name)
                                                    setEditIsPublic(folder.public)
                                                }}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteFolder(folder.id)
                                                }}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FavoriteFoldersPage
