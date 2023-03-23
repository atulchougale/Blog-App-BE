import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../model/user.js";
import Token from '../model/token.js';
import Post from '../model/post.js';
dotenv.config();


// user registretion 

export const singupUser = async (request, response) => {

    const { name, email, password, pic, username } = request.body
    if (!email || !password || !name) {
        return response.status(422).json({ error: "please add all the fields" })
    }
    try {
        const oldUser = await User.findOne({ email: email })
        if (oldUser) {
            return response.status(422).json({ error: "user already exists with that email" })

        } else {
            const hashPassword = await bcrypt.hash(request.body.password, 10);


            const user = { name, email, username, password: hashPassword, pic };

            const newUser = new User(user);
            await newUser.save();

            return response.status(200).json({ msg: 'signup successfull' });
        }


    } catch (error) {
        return response.status(500).json({ msg: 'Error while sign the user', error });
    }
}


// login user
export const loginUser = async (request, response) => {

    const { email, password } = request.body
    if (!email || !password) {
        return response.status(422).json({ error: "please add email or password" })
    }
    let user = await User.findOne({ email: request.body.email });
    if (!user) {
        return response.status(400).json({ msg: 'Email dose not match' });

    }

    try {
        let passMatch = await bcrypt.compare(request.body.password, user.password);
        if (passMatch) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '35m' });
            const refresToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);

            const newToken = new Token({ token: refresToken });
            await newToken.save();

            return response.status(200).json({ accessToken: accessToken, refresToken: refresToken, name: user.name, username: user.username, id: user._id, followers: user.followers, following: user.following, pic: user.pic })

        } else {
            return response.status(400).json({ msg: "Password Not Match" })
        }
    } catch (error) {
        return response.status(500).json({ msg: 'Error while login in user' })
    }
}

// log out user
export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}


// update Profile picture

export const updateProfilePic = async (request, response) => {
    try {
        const user = await User.findByIdAndUpdate(
            request.user._id,
            { $set: { pic: request.body.pic } },
            { new: true }
        );

        return response.status(200).json({ isSuccess: true, data: user });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ isSuccess: false, message: err.message });
    }
};

//  see othres profile 
export const othersProfile = async (request, response) => {

    try {
        const user = await User.findOne({ _id: request.params.id }).select('-password');
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }
        const posts = await Post.find({ postedBy: request.params.id })
            .populate("postedBy", "_id name", { strictPopulate: false })
            .exec();
        return response.status(200).json({ user, posts });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

// follow the other 


export const follow = async (request, response) => {
    try {
      const userToFollow = await User.findByIdAndUpdate(
        request.body.followId,
        { $push: { followers: request.user._id } },
        { new: true }
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        request.user._id,
        { $push: { following: request.body.followId } },
        { new: true }
      ).select("-password");
  
      response.json(updatedUser);
    } catch (error) {
      response.status(422).json({ error: error.message });
    }
  };
  



  
export const unfollow = async (request, response) => {
    try {
      const userToFollow = await User.findByIdAndUpdate(
        request.body.followId,
        { $pull: { followers: request.user._id } },
        { new: true }
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        request.user._id,
        { $pull: { following: request.body.followId } },
        { new: true }
      ).select("-password");
  
      response.json(updatedUser);
    } catch (error) {
      response.status(422).json({ error: error.message });
    }
  };
  