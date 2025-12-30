import express from 'express';
import { adminLogin, deletePlace, getAllOrganizers, getAllUsers, getPendingTrips } from '../controllers/admin.controller.js';
import { getAllPlaces } from '../controllers/admin.controller.js';
import { addPlace } from '../controllers/admin.controller.js';
import { approveTrip } from '../controllers/admin.controller.js';
const router = express.Router();

router.post('/login', adminLogin);

router.get('/places', getAllPlaces);
router.get('/users', getAllUsers);
router.get('/trips/pending', getPendingTrips);

router.post('/places', addPlace);
router.post('/trips/approve/:id', approveTrip); // approve trips from agencies

router.delete('/places/:id', deletePlace);

router.get('/oganizers',getAllOrganizers); 


export default router;
