const express = require('express');
const router = express.Router();
const appartmentsController = require('../controllers/appartments.controller');

// Routes
router.get('/', appartmentsController.getAllAppartments);
router.post('/', appartmentsController.createAppartment);
router.get('/:id', appartmentsController.getAppartment);
router.put('/:id', appartmentsController.updateAppartment);
router.delete('/:id', appartmentsController.deleteAppartment);
router.post('/:id/reservations', appartmentsController.createReservation);
router.get('/:id/reservations', appartmentsController.getAllReservationsByAppartment);
router.get('/:id/reservations/:rid', appartmentsController.getReservationByAppartment);
router.put('/:id/reservations/:rid', appartmentsController.updateReservationStatus);
router.delete('/:id/reservations/:rid', appartmentsController.deleteReservationByAppartment);

module.exports = router;