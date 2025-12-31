import express from 'express';
import { 
    adminLogin, 
    approveOrganizer, 
    deletePlace, getAllOrganizers,
    getAllTrips, getAllUsers,
    rejectOrganizer,
    rejectTrip ,
    getAllPlaces,
    addPlace,
    approveTrip
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', getAllUsers);

//places routes
router.get('/places', getAllPlaces);
router.post('/places', addPlace);
router.delete('/places/:id', deletePlace);

//trips routes
router.get('/trips', getAllTrips);
router.post('/trips/:id/approve', approveTrip); // approve trips from agencies
router.delete('/trips/:id/reject',rejectTrip)  // reject trips from agencies

//organizer routes
router.get('/organizers',getAllOrganizers); 
router.post('/organizers/:id/approve', approveOrganizer); // approve  agencies
router.delete('/organizers/:id/delete', rejectOrganizer); // reject agencies

export default router;
