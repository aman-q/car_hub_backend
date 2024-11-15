import express from 'express';
import { getallcars, addcar, removecar,updateCar,usercar,singlecardeatil } from '../controller/car.controller.js';
import authMiddleware from '../middleware/authenticateToken.js';
import uploadMiddleware from '../middleware/file.middleware.js'

const carRouter = express.Router();

// Get All Cars
carRouter.get('/', getallcars);
// Add new Car
carRouter.post('/',authMiddleware,uploadMiddleware,addcar);
// Update Car
carRouter.put('/:id',authMiddleware,uploadMiddleware,updateCar);
// Delete Car 
carRouter.delete('/:id', authMiddleware,removecar);

// Get All the cars of user 
carRouter.get('/usercars',authMiddleware,usercar);

// GET a Car Details 
carRouter.get('/:id',authMiddleware,singlecardeatil);

export default carRouter;