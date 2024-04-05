import express from 'express';
import { getAllUsers, loginUser,registerUser,deleteUserById,getMe} from '../controllers/user-controllers.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Route to get all users
router.get('/', getAllUsers);

// Route to create a new user
router.post('/', registerUser);


router.post('/login',loginUser);


// Route to delete Project By Id
router.delete('/:id',deleteUserById)

router.route('/me').get(protect,getMe);

export default router;