const database = require('../datalayer/mssql.dao');
var postcode = require('postcode-validator');

module.exports = {

    getAllAppartments: (req, res, next) => {
        
        console.log("getAllAppartments called");

        const query = "SELECT * FROM Apartment JOIN Reservation ON Apartment.ApartmentId = Reservation.ApartmentId JOIN DBUser ON Reservation.UserId = DBUser.UserId;";

        database.dbQuery(query, (err, rows) => {
            // handle result
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
                
            }
            if(rows){
                res.status(200).json({result: rows});
            }
        })
    },

    createAppartment: (req, res, next) => {
        console.log("createAppartment called");
        const appartment = req.body;

        // Check if postalcode is valid
        if(!postcode.validate(appartment.PostalCode, 'NL')) // returns true
        {
            console.log("Not valid");
            errorObject = {
                message : 'Postal code is not valid!',
                code : 500
            }

            next(errorObject);
            return;
        }

        const query = `INSERT INTO Apartment VALUES('${appartment.Description}', '${appartment.StreetAddress}', '${appartment.PostalCode}', '${appartment.City}', ${appartment.UserId} )`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({result: 200});
            }
        })
    },

    getAppartment: (req, res ,next) => {
        console.log("getAppartment called");

        const id = req.params.id;
        const query = `SELECT * FROM Apartment WHERE Apartment.ApartmentId=${id}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }            
            if(rows){
                res.status(200).json({result: rows});
            }
        });

        console.log(query);

    },

    updateAppartment: (req, res, next) => {

        console.log("update appartment called");

        const appartment = req.body;
        const id = req.params.id;

        const query = `UPDATE Apartment SET Apartment.Description = '${appartment.Description}', Apartment.StreetAddress = '${appartment.StreetAddress}', Apartment.PostalCode = '${appartment.PostalCode}', Apartment.City = '${appartment.City}' WHERE Apartment.ApartmentId = ${id};`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({result: appartment});
            }
        })
    },

    //TODO: Authenticate user, he's the only one to delete it
    deleteAppartment: (req, res, next) => {
        
        console.log("deleteAppartment");

        const id = req.params.id;
        const query = `DELETE FROM Apartment WHERE Apartment.ApartmentId=${id}`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({});
            }
        })
    },

    createReservation: (req, res, next) => {

        const id = req.params.id;
        const reservation = req.body;

        const query = `INSERT INTO Reservation VALUES(${id}, '${reservation.StartDate}', '${reservation.EndDate}', '${reservation.Status}', ${reservation.UserId});`;

        console.log(query);

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({});
            }
        })
    },

    getAllReservationsByAppartment: (req, res, next) => {

        console.log("getAllReservationsByAppartment");

        const id = req.params.id;
        query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId = ${id};`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({Result: rows});
            }
        })
    },

    getReservationByAppartment: (req, res, next) => {

        console.log("getReservationByAppartment");

        const id = req.params.id;
        const rid = req.params.rid;

        const query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId = ${id} AND Reservation.ReservationId = ${rid};`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({Result: rows});
            }
        })        
    },

    updateReservationStatus: (req, res, next) => 
    {
        console.log("updateReservationStatus");

        const id = req.params.id;
        const rid = req.params.rid;
        const Registration = req.body;

        const query = `UPDATE Reservation SET Reservation.Status = '${Registration.Status}' WHERE Reservation.reservationId=${rid} AND Reservation.ApartmentId=${id};`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({});
            }
        })
    },

    deleteReservationByAppartment:  (req, res, next) => {

        console.log("updateReservationStatus");

        const id = req.params.id;
        const rid = req.params.rid;
        
        const query = `DELETE FROM Reservation WHERE Reservation.reservationId = ${rid} AND Reservation.apartmentId = ${id}`;

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({});
            }
        })

    }
}