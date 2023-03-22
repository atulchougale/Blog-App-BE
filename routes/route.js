import  express from 'express';
import { authenticateToken } from '../controller/jwt-controller.js';
import { createPost , getAllPosts ,getPost, updatePost, deletePost, likePost, unlikePost,getMyPosts } from '../controller/post-controller.js';
import { singupUser,loginUser, logoutUser,updateProfilePic, othersProfile,follow }  from '../controller/user-controller.js';
import { newComment ,getComments, deleteComment } from '../controller/comment-controller.js';
const router = express.Router();

// user route
router.post('/singup',singupUser);
router.post('/login',loginUser);
router.post('/logout', logoutUser);
router.put('/updatepic',authenticateToken,updateProfilePic)
router.get('/user/:id', authenticateToken, othersProfile)
router.put('/follow',authenticateToken,follow)


// Blog routs
router.post('/create',authenticateToken,createPost);
router.get('/posts',authenticateToken,getAllPosts);
router.get('/post/:id',authenticateToken,getPost);
router.put('/update/:id',authenticateToken,updatePost);
router.delete('/delete/:id',authenticateToken ,deletePost);
router.put('/like/:id' ,authenticateToken ,likePost);
router.put('/unlike/:id' ,authenticateToken ,unlikePost);
router.get('/mypost', authenticateToken ,getMyPosts)


// comments routs
router.post('/comment/new' , authenticateToken, newComment );
router.get('/comments/:id', authenticateToken, getComments);
router.delete('/comment/delete/:id' ,authenticateToken, deleteComment)






export default router; 