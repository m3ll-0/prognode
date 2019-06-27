const express = require('express');
const router = express.Router();
const appartmentsController = require('../controllers/appartments.controller');
const authController = require('../controllers/auth.controller')

// Routes
router.get('/', authController.validateToken, appartmentsController.getAllAppartments);
router.post('/', authController.validateToken, appartmentsController.createAppartment);
router.get('/:id', authController.validateToken, appartmentsController.getAppartment);
router.put('/:id', authController.validateToken, appartmentsController.checkAppartment, appartmentsController.checkOwner, appartmentsController.updateAppartment);
router.delete('/:id', authController.validateToken, appartmentsController.checkAppartment, appartmentsController.checkOwner, appartmentsController.deleteAppartment);
router.post('/:id/reservations', authController.validateToken, appartmentsController.createReservation);
router.get('/:id/reservations', authController.validateToken, appartmentsController.getAllReservationsByAppartment);
router.get('/:id/reservations/:rid', authController.validateToken, appartmentsController.checkAppartment, appartmentsController.checkReservation, appartmentsController.getReservationByAppartment);
router.put('/:id/reservations/:rid', authController.validateToken, appartmentsController.checkAppartment, appartmentsController.checkReservation, appartmentsController.checkOwner, appartmentsController.updateReservationStatus);
router.delete('/:id/reservations/:rid', authController.validateToken, appartmentsController.checkAppartment, appartmentsController.deleteReservationByAppartment);

module.exports = router;