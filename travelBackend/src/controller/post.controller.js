const asyncHandler = require("../middleware/asyncHandler");
const postModel = require("../models/post.model");

const postShare = asyncHandler(async (req, res) => {
  const { title, content, images } = req.body;
  const userId = req.userId;
  if (!title || !content) {
    res.status(400);
    throw new Error("Thiếu thông tin bắt buộc");
  }
  const newPost = new postModel({
    title,
    content,
    images,
    author: userId,
  });

  const savePost = await newPost.save();
  res.status(201).json({
    data: savePost,
    success: true,
    error: false,
  });
});
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postModel
    .find()
    .populate("author", "username email")
    .populate("comments.user", "username") // QUAN TRỌNG: populate comments.user
    .sort({ createdAt: -1 });

  res.json({
    data: posts,
    success: true,
    error: false,
  });
});

const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const post = await postModel.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Bài viết không tồn tại");
  }
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();
  } else {
    post.likes.push(userId);
    await post.save();
  }
  res.status(200).json({
    data: post,
    success: true,
    error: false,
  });
});
const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const post = await postModel.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Bài viết không tồn tại");
  }
  if (post.author.toString() !== userId.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Bạn không có quyền xóa bài viết này");
  }
  await post.deleteOne();
  res.status(200).json({
    message: "Xóa bài viết thành công",
    success: true,
    error: false,
  });
});
const postComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Thiếu nội dung bình luận");
  }

  const newComment = {
    user: userId,
    content,
    createdAt: new Date(),
  };

  // Thêm comment và populate luôn
  const updatedPost = await postModel
    .findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      {
        new: true, // Trả về document đã update
        runValidators: true,
      }
    )
    .populate("comments.user", "username")
    .populate("author", "username");

  if (!updatedPost) {
    res.status(404);
    throw new Error("Bài viết không tồn tại");
  }

  res.status(201).json({
    data: updatedPost,
    success: true,
    error: false,
  });
});
const deleteComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const userId = req.userId;
    const post = await postModel.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Bài viết không tồn tại");
    }   
    const comment = post.comments.id(commentId);
    if (!comment) { 
        res.status(404);
        throw new Error("Bình luận không tồn tại");
    }   
    if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Bạn không có quyền xóa bình luận này");
    }
    comment.deleteOne();
    await post.save();
    res.status(200).json({
        message: "Xóa bình luận thành công",
        success: true,
        error: false,
    });
});

module.exports = { postShare, getAllPosts, likePost, deletePost, postComment, deleteComment };
