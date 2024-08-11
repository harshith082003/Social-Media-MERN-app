const User = require('../models/User');
const Post = require('../models/Post');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists'
              })
        }

        user = await User.create({
            name, 
            email,
            password,
            avatar: {
                public_id: 'sample_id',
                url: 'sampleUrl'
            }
        });

        const token = await user.generateToken();
        
        const cookieOptions = {
            maxAge: new Date(Date.now() + 30*24*60*60*1000), 
            httpOnly: true,
        }

        res.status(201).cookie('token', token, cookieOptions).json({
            success: true,
            user,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        const token = await user.generateToken();

        const cookieOptions = {
            expires: new Date(Date.now() + 30*24*60*60*1000), 
            httpOnly: true
        }

        res.status(200).cookie('token', token, cookieOptions).json({
            success: true,
            user,
            token
        });
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {

        res
            .status(200)
            .cookie('token', null, { 
                expires: new Date(Date.now()),
                httpOnly: true
            })
            .json({
                success: true,
                message: "logged out"
            })
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const followUser = async (req, res) => {

    try {

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(loggedInUser._id.toString() === userToFollow._id.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        if(loggedInUser.following.includes(userToFollow._id)){
            const indexofFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexofFollowers = userToFollow.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexofFollowing, 1);
            userToFollow.followers.splice(indexofFollowers, 1);
                        
            await loggedInUser.save();
            await userToFollow.save();

            return res.status(200).json({
                success: true,
                message: 'User unfollowed'
            });

        } else {
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
    
            await loggedInUser.save();
            await userToFollow.save();
    
            return res.status(200).json({
                success: true,
                message: 'User followed'
            });
        } 

       
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const { oldPassword, newPassword} = req.body;
        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            }); 
        }

        user.password = newPassword;
        await user.save();
 
        return res.status(200).json({
            success: true,
            message: 'password updated'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const { email, name } = req.body;

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }

        user.save();

         return res.status(200).json({
            success: true,
            message: 'User profile updated'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        return res.status(200).json({
            success: true,
            user
        });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).populate('posts');

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({});

        return res.status(200).json({
            success: true,
            users
        });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        await user.deleteOne();

        //logout user after deletion 
        res.cookie('token', null, { 
            expires: new Date(Date.now()),
            httpOnly: true
        })

        // Delete user posts
        for(let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.deleteOne();
        }

        //Remove user from all of its followers' following array 
        for(let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i])

            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }
                   
        //Remove user from all of its followings' followers array 
        for(let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i])

            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
        }
        return res.status(200).json({
            success: true,
            message: 'User profile deleted'
        });
           
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { registerUser, loginUser, followUser, logoutUser, updatePassword, updateUserProfile, deleteUserProfile, getMyProfile, getUserProfile, getAllUsers }