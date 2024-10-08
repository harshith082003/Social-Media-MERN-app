const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: 'req.body.public_id',
                url: 'req.body.url'
            },
            owner: req.user._id
        }

        const newPost = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json({
            success: true,
            post: newPost
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if(req.user._id.toString() !== post.owner.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        await post.deleteOne();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.user._id);
        user.posts.splice(index, 1)
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Post deleted'
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const likeAndUnlikePost = async(req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        
        if(post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post unliked'
            })

        } else {
            post.likes.push(req.user._id);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post liked'
            })
        }

        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getPostsOfFollowing = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)

        
        const posts = await Post.find({
            owner: {
                $in: user.following
            }
        })

        res.status(200).json({
            success: true,
            posts
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createPost, likeAndUnlikePost, deletePost, getPostsOfFollowing }