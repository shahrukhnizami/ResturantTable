import express from 'express';
import { createCamera,      getAllCameras,   getAllCamerasByRestaurantId,   getCameraById,   updateCamera, updateCameraStatus } from '../controllers/camera.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import isAdminAndActive from '../middlewares/isAdminAndActive.middleware.js';
import isRestaurantAdminAndActive from '../middlewares/isRestaurantAdminAndActive.middleware.js';
import checkCameraStatus from '../middlewares/checkCameraStatus.middleware.js';
import { isTokenBlacklisted } from '../middlewares/isTokenBlacklisted.middleware.js';

const router = express.Router();

router.get('/allcamera', getAllCameras);
router.get('/:id', authenticateUser ,isTokenBlacklisted,isRestaurantAdminAndActive, isAdminAndActive ,checkCameraStatus,getCameraById);
router.get('/allcamera/:restaurantId', authenticateUser ,isTokenBlacklisted,isRestaurantAdminAndActive, isAdminAndActive , getAllCamerasByRestaurantId);
router.post('/create', authenticateUser ,isTokenBlacklisted, isRestaurantAdminAndActive, isAdminAndActive ,  createCamera);
router.put('/:id', authenticateUser ,isTokenBlacklisted, isRestaurantAdminAndActive,isAdminAndActive ,checkCameraStatus ,updateCamera);
router.patch('/:id', authenticateUser , isTokenBlacklisted,isRestaurantAdminAndActive ,isAdminAndActive , updateCameraStatus);


export default router; 