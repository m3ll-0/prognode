const express = require('express');
const router = express.Router();
const appartmentsController = require('../controllers/appartments.controller');
const authController = require('../controllers/auth.controller')

// Routes
router.get('/', authController.validateToken, appartmentsController.getAllAppartments);
router.post('/', authController.validateToken, appartmentsController.createAppartment);
router.get('/:id', authController.validateToken, appartmentsController.getAppartment);
router.put('/:id', authController.validateToken, appartmentsController.updateAppartment);
router.delete('/:id', authController.validateToken, appartmentsController.deleteAppartment);
router.post('/:id/reservations', authController.validateToken, appartmentsController.createReservation);
router.get('/:id/reservations', authController.validateToken, appartmentsController.getAllReservationsByAppartment);
router.get('/:id/reservations/:rid', authController.validateToken, appartmentsController.getReservationByAppartment);
router.put('/:id/reservations/:rid', authController.validateToken, appartmentsController.updateReservationStatus);
router.delete('/:id/reservations/:rid', authController.validateToken, appartmentsController.deleteReservationByAppartment);

// router.get('/', appartmentsController.getAllAppartments);
// router.post('/', appartmentsController.createAppartment);
// router.get('/:id', appartmentsController.getAppartment);
// router.put('/:id', appartmentsController.updateAppartment);
// router.delete('/:id', appartmentsController.deleteAppartment);
// router.post('/:id/reservations',  appartmentsController.createReservation);
// router.get('/:id/reservations',  appartmentsController.getAllReservationsByAppartment);
// router.get('/:id/reservations/:rid',  appartmentsController.getReservationByAppartment);
// router.put('/:id/reservations/:rid',  appartmentsController.updateReservationStatus);
// router.delete('/:id/reservations/:rid', appartmentsController.deleteReservationByAppartment);

module.exports = router;