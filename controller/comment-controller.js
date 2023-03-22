
import Comment from "../model/comment.js";

// create new comment
export const newComment = async (request, response) => {
    try {
        const comment = await new Comment(request.body);
        comment.save();

        response.status(200).json('Comment saved successfully');
    } catch (error) {
        response.status(500).json({error:error.message});
    }
}


// get all commets on blog page 
export const getComments = async(request,response)=>{
    try {
        const comments = await Comment.find({postId : request.params.id});

        return response.status(200).json(comments)
    } catch (error) {
        response.status(500).json({error:error.message});

    }
}

// Delete the comment
export const deleteComment = async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        await comment.delete()

        response.status(200).json('comment deleted successfully');
    } catch (error) {
        response.status(500).json(error)
    }
}

