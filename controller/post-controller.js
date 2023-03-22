
import Post from "../model/post.js";




//  crete Blog 
export const createPost = async (request, response) => {
    try {

        const { title, description, picture, username, categories } = request.body
        if (!title || !description ) {
            return response.status(422).json({ error: "Plase add all the fields" })
        }
        request.user.password = undefined
        const post = await new Post({
            title,
            description,
            picture,
            username,
            categories,
            postedBy: request.user
        })


        // const post = await new Post(request.body);
        post.save();

        response.status(200).json({ msg: 'Post saved successfully' });
    } catch (error) {
        response.status(500).json(error);
       
    }
}


// get all Blogs on home page
export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let posts;
    try {
        if (username)
            posts = await Post.find({ username: username });
        else if (category)
            posts = await Post.find({ categories: category });
        else
            posts = await Post.find({});


        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error, { msg: error.message })
    }
}

// get Blog details on particular Blog page 
export const getPost = async (request, response) => {
    try {
        const post = await Post.findByIdAndUpdate(request.params.id, { $inc: { viewCount: 1 } })
        .populate("postedBy", "_id name", { strictPopulate: false }); 
        // post.viewCount=post.viewCount+1
        // console.log(post.viewCount)

        return response.status(200).json(post);
    } catch (error) {
        response.status(500).json({ msg: error.message });

    }
}


// get all blog of user

export const getMyPosts = async (request,response)=>{
    try {
        const myPost = await  Post.find({postedBy:request.user._id})
        .populate("postedBy", "_id name", { strictPopulate: false });  
        
        return response.status(200).json(myPost);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}


// update Blog 

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({ msg: 'post not found' });
        }

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
        return response.status(200).json({ msg: 'Post Update Successfully' })
    } catch (error) {
        response.status(500).json({ error: error.message });

    }
}


// Delete Blog 
export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({ msg: 'post not found' });
        }

        await post.delete()
        return response.status(200).json({ msg: 'Post Deleted Successfully' })
    } catch (error) {
        response.status(500).json({ error: error.message });

    }
}


export const likePost = async (request, response) => {
    try {


        const post = await Post.findByIdAndUpdate(request.params.id, { $push: { likes: request.user._id } }, { new: true });


        // await Post.findByIdAndUpdate(request.params.id, {$push: { likes: request.user._id }}, {new: true});
        return response.status(200).json(post)
    } catch (error) {
        response.status(500).json({ error: error.message });

    }
}

export const unlikePost = async (request, response) => {
    try {


        const post = await Post.findByIdAndUpdate(request.params.id, { $pull: { likes: request.user._id } }, { new: true });
        return response.status(200).json(post)
    } catch (error) {
        response.status(500).json({ error: error.message });

    }
}