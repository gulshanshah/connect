const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Post = require('../models/Post');
const Story = require('../models/Story');
const User = require('../models/User'); 
const deleteFiles = require('../deleting/deleteFiles');
const GroupChat = require('../models/GroupChat');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/posts', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const posts = await Post.find()
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map(post => ({
      postId: post._id,
      caption: post.caption,
      postImages: post.postImages,
      createdAt: post.createdAt,
      user: {
        userId: post.user._id,
        username: post.user.username,
        profilePicture: post.user.profileImage,
      },
      totalLikes: post.likes.length,
      likedByUser: post.likes.includes(userId)
    }));

    res.json({ posts: formattedPosts });
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.post('/posts', upload.array('images', 5), async (req, res) => {
  try {
    const { caption, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: 'User id is required' });
    }

    const imagePaths = req.files && req.files.length > 0
      ? req.files.map(file => file.path)
      : [];

    if (!caption && imagePaths.length === 0) {
      return res.status(400).json({ msg: 'Either a caption or at least one image is required' });
    }

    const post = new Post({
      user: userId,
      caption: caption || '',
      postImages: imagePaths,
    });

    await post.save();
    res.json({ post });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find().populate('userId', 'username profileImage').sort({ postedAt: -1 });

    const formattedStories = stories.map(story => ({
      storyId: story._id,
      images: story.images,
      postedAt: story.postedAt,
      user: {
        userId: story.userId._id,
        username: story.userId.username,
        profilePicture: story.userId.profileImage,
      },
    }));

    res.json({ stories: formattedStories });
  } catch (err) {
    console.error('Error fetching stories:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.post('/stories', upload.array('images', 5), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: 'User id is required' });
    }

    const imagePaths =
      req.files && req.files.length > 0
        ? req.files.map(file => file.path)
        : [];

    if (imagePaths.length === 0) {
      return res.status(400).json({ msg: 'At least one image is required for a story' });
    }

    const story = new Story({
      userId: userId,
      images: imagePaths,
    });

    await story.save();
    res.json({ story });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments.user', 'username profileImage')
      .select('comments -_id');

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const formattedComments = post.comments.map(comment => ({
      id: comment._id,
      text: comment.text,
      user: {
        id: comment.user._id,
        username: comment.user.username,
        profilePicture: comment.user.profileImage
      },
      createdAt: comment.createdAt
    }));

    res.json({ comments: formattedComments });
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ msg: 'Invalid input data' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const newComment = {
      user: userId,
      text: text
    };

    post.comments.unshift(newComment);
    await post.save();

    const populatedComment = await Post.populate(post, {
      path: 'comments.user',
      select: 'username profileImage'
    });

    const createdComment = populatedComment.comments[0];

    res.json({
      comment: {
        id: createdComment._id,
        text: createdComment.text,
        user: {
          id: createdComment.user._id,
          username: createdComment.user.username,
          profilePicture: createdComment.user.profileImage
        },
        createdAt: createdComment.createdAt
      }
    });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const isLiked = post.likes.some(id => id.toString() === userId.toString());

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    
    res.json({ liked: !isLiked, likeCount: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


router.put('/profile/setup', upload.single('profileImage'), async (req, res) => {
  try {
    const { userId, name } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};

    if (name) {
      updates.name = name;
    }

    if (req.file) {
      if (user.profileImage !== 'uploads/default.png') {
        deleteFiles([user.profileImage]);
      }
      updates.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: '-password -refreshToken' }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        profileImage: updatedUser.profileImage,
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.put('/:groupId/edit-group', upload.single('groupImage'), async (req, res) => {
  try {
    const { groupName } = req.body;
    const groupId = req.params.groupId;

    const group = await GroupChat.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const updates = {};

    if (groupName) {
      updates.groupName = groupName;
    }

    if (req.file) {
      if (group.groupImage && group.groupImage !== 'uploads/group.png') {
        deleteFiles([group.groupImage]);
      }

      updates.groupImage = req.file.path;
    }

    const updatedGroup = await GroupChat.findByIdAndUpdate(
      groupId,
      { $set: updates },
      { new: true }
    );

    res.json({
      message: 'Group updated successfully',
      group: {
        id: updatedGroup._id,
        groupName: updatedGroup.groupName,
        groupImage: updatedGroup.groupImage,
        members: updatedGroup.members,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
