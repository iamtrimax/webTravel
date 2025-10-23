import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, MoreVertical, Plus, Users, MessageCircle, Heart, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import sumaryApi from '../../common';

const AdminPostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const postsPerPage = 10;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(sumaryApi.getAllPosts.url, {
                method: sumaryApi.getAllPosts.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            } else {
                toast.error('Lỗi khi tải bài viết');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter posts based on search and
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Action handlers
    const handleViewDetail = (post) => {
        setSelectedPost(post);
        setShowDetailModal(true);
        setShowComments(false);
    };

    const handleToggleComments = () => {
        setShowComments(!showComments);
    };
    const handleDelete = async (postId) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                const response = await fetch(sumaryApi.deletePost.url.replace(':id', postId), {
                    method: sumaryApi.deletePost.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    toast.success('Đã xóa bài viết');
                    setPosts(posts.filter(post => post._id !== postId));
                    setShowDetailModal(false);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Lỗi khi xóa bài viết');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
            try {
                const response = await fetch(sumaryApi.deleteComment.url.replace(':id', selectedPost._id).replace(':commentId', commentId), {
                    method: sumaryApi.deleteComment.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    // Cập nhật danh sách comments
                    setSelectedPost(prev => ({
                        ...prev,
                        comments: prev.comments.filter(comment => comment._id !== commentId)
                    }));
                    // Cập nhật danh sách posts
                    setPosts(posts.map(post =>
                        post._id === selectedPost._id
                            ? { ...post, comments: post.comments.filter(comment => comment._id !== commentId) }
                            : post
                    ));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Lỗi khi xóa bình luận');
            }
        }
    };

    // Stats calculation
    const stats = {
        total: posts.length,
    };

    return (
        <div className="min-h-screen bg-[0f0f0f] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400">Quản Lý Bài Viết</h1>
                    <p className="text-gray-400 mt-2">Quản lý và kiểm duyệt bài viết từ người dùng</p>
                </div>

                {/* Stats Cards */}
                <div className="w-full justify-center gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-lg shadow-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Tổng bài viết</p>
                                <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-lg shadow-lg border border-gray-700 mb-6">
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết hoặc tác giả..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Posts Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                                <tr>
                                    
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Bài viết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tác giả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tương tác
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Ngày đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] divide-y divide-gray-700">
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">
                                                <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gray-700 rounded animate-pulse"></div>
                                                    <div className="space-y-2">
                                                        <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                                                        <div className="w-24 h-3 bg-gray-700 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                                                    <div className="w-24 h-3 bg-gray-700 rounded animate-pulse"></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <div className="w-8 h-6 bg-gray-700 rounded animate-pulse"></div>
                                                    <div className="w-8 h-6 bg-gray-700 rounded animate-pulse"></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
                                                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : currentPosts.length > 0 ? (
                                    currentPosts.map((post) => (
                                        <tr key={post._id} className="hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {post.images && post.images.length > 0 && (
                                                        <img
                                                            src={post.images[0].url}
                                                            alt={post.title}
                                                            className="w-12 h-12 object-cover rounded border border-gray-600"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-white line-clamp-2">
                                                            {post.title}
                                                        </p>
                                                        <p className="text-sm text-gray-400 line-clamp-1">
                                                            {post.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{post.author?.username}</p>
                                                    <p className="text-sm text-gray-400">{post.author?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                    <div className="flex items-center space-x-1">
                                                        <Heart className="w-4 h-4" />
                                                        <span>{post.likes?.length || 0}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span>{post.comments?.length || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetail(post)}
                                                        className="p-1 text-cyan-400 hover:bg-cyan-400/20 rounded transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-24 text-center">
                                            <div className="text-gray-500">
                                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                                <p className="text-lg font-medium text-gray-400">Không tìm thấy bài viết nào</p>
                                                <p className="mt-1 text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400">
                                    Hiển thị <span className="font-medium text-white">{indexOfFirstPost + 1}</span> đến{' '}
                                    <span className="font-medium text-white">
                                        {Math.min(indexOfLastPost, filteredPosts.length)}
                                    </span>{' '}
                                    trong <span className="font-medium text-white">{filteredPosts.length}</span> kết quả
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Trước
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 border rounded-md ${currentPage === page
                                                ? 'bg-cyan-600 text-white border-cyan-600'
                                                : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Detail Modal với Comments */}
            {showDetailModal && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-10000">
                    <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-cyan-400">Chi tiết bài viết</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Post Content */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-750 rounded-lg p-6 mb-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">{selectedPost.title}</h4>
                                        <p className="text-gray-300 whitespace-pre-line">{selectedPost.content}</p>

                                        {/* Images */}
                                        {selectedPost.images && selectedPost.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {selectedPost.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image.url}
                                                        alt={`${selectedPost.title} ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded border border-gray-600"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Tags */}
                                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {selectedPost.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-cyan-600 text-white text-sm rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Comments Section */}
                                    <div className="bg-gray-750 rounded-lg p-6">
                                        <button
                                            onClick={handleToggleComments}
                                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4"
                                        >
                                            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            <span>Bình luận ({selectedPost.comments?.length || 0})</span>
                                        </button>

                                        {showComments && (
                                            <div className="mt-4">
                                                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                                        {selectedPost.comments.map((comment) => (
                                                            <div key={comment._id} className="bg-gray-700 rounded-lg p-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                            {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white font-medium">{comment.user?.username || 'Người dùng'}</p>
                                                                            <p className="text-gray-400 text-sm">
                                                                                {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                        className="text-red-400 hover:text-red-300 p-1"
                                                                        title="Xóa bình luận"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <p className="text-gray-300 ml-11">{comment.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-400">
                                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                        <p>Chưa có bình luận nào</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Post Info Sidebar */}
                                <div className="space-y-6">
                                    {/* Post Info */}
                                    <div className="bg-gray-750 rounded-lg p-4">
                                        <h5 className="font-semibold text-white mb-4">Thông tin bài viết</h5>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-400">Tác giả</p>
                                                <p className="text-white">{selectedPost.author?.username}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-400">Email</p>
                                                <p className="text-white">{selectedPost.author?.email}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-400">Ngày đăng</p>
                                                <p className="text-white">{new Date(selectedPost.createdAt).toLocaleString('vi-VN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Tương tác</p>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-white flex items-center gap-1">
                                                        <Heart className="w-4 h-4" /> {selectedPost.likes?.length || 0}
                                                    </span>
                                                    <span className="text-white flex items-center gap-1">
                                                        <MessageCircle className="w-4 h-4" /> {selectedPost.comments?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="bg-gray-750 rounded-lg p-4">
                                        <h5 className="font-semibold text-white mb-4">Thao tác</h5>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    handleDelete(selectedPost._id);
                                                }}
                                                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Xóa bài viết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPostManagement;