const database = require('../datalayer/mssql.dao');
const postalcodeValidator = new RegExp('^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$');

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
        const userId = req.userId;

        // Check if postalcode is valid
        if(postalcodeValidator.test(appartment.PostalCode) != true)
        {
          errorObject = {
            message : 'Postal Code is not valid!',
            code : 500
          } 

          next(errorObject);
          return;
        }

        const query = `INSERT INTO Apartment VALUES('${appartment.Description}', '${appartment.StreetAddress}', '${appartment.PostalCode}', '${appartment.City}', ${userId} )`;

        console.log(query);

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
        const query = `SELECT * FROM Apartment INNER JOIN DBUser ON Apartment.UserId = DBUser.UserId INNER JOIN Reservation ON Reservation.ApartmentId = Apartment.ApartmentId WHERE Apartment.ApartmentId=${id}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }            
            if(rows){

                // Check if appartment exists
                if(rows.length == 0)
                {
                    const errorObject = {
                        message: 'Appartment does not exist!',
                        code: 404
                    }
                    next(errorObject);
                }
                else{
                    res.status(200).json({result: rows});
                }
            }
        });

        console.log(query);

    },

    updateAppartment: (req, res, next) => {

        console.log("update appartment called");

        const appartment = req.body;
        const id = req.params.id;

        // Check if postalcode is valid
        if(postalcodeValidator.test(appartment.PostalCode) != true)
        {
          errorObject = {
            message : 'Postal Code is not valid!',
            code : 500
          } 

          next(errorObject);
          return;
        }

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
        const callerUserId = req.userId;
        const queryDelete = `DELETE FROM Apartment WHERE Apartment.ApartmentId=${id}`;
        const queryCheck = `SELECT * FROM Apartment WHERE Apartment.ApartmentId=${id} AND Apartment.UserId = ${callerUserId}`

        console.log(queryCheck);

        database.dbQuery(queryCheck, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                if(rows.length == 0)
                {
                    const errorObject = {
                        message: 'You are not authorized to delete apartment or object does not exist.',
                        code: 401
                    }
                    next(errorObject);
                }
                else{
                    database.dbQuery(queryDelete, (err, rows) => {

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
        })


    },

    createReservation: (req, res, next) => {

        const id = req.params.id;
        const reservation = req.body;
        const userId = req.userId;

        const query = `INSERT INTO Reservation VALUES(${id}, '${reservation.StartDate}', '${reservation.EndDate}', '${reservation.Status}', ${userId});`;

        // Check dates
        if(Date.parse(reservation.EndDate) < Date.parse(reservation.StartDate))
        {
            const errorObject = {
                message: 'Start date is not before end date.',
                code: 500
            }
            next(errorObject);
        }

        console.log(query);

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Database error.',
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
                if(rows == 0)
                {
                    const errorObject = {
                        message: 'Error: Reservation not found.',
                        code: 404
                    }
                    next(errorObject);       
                }
                else
                {
                    res.status(200).json({Result: rows});
                }
            }
        })        
    },

    updateReservationStatus: (req, res, next) => 
    {
        console.log("updateReservationStatus");

        const id = req.params.id;
        const rid = req.params.rid;
        const Registration = req.body;
        const userId = req.userId;

        const queryUpdate = `UPDATE Reservation SET Reservation.Status = '${Registration.Status}' WHERE Reservation.reservationId=${rid} AND Reservation.ApartmentId=${id};`;
        const queryCheck = `SELECT * FROM Reservation WHERE Reservation.UserId =${userId} AND Reservation.ReservationId = ${rid}`;

        // Check if status is valid
        if( !(Registration.Status == "INITIAL") || (Registration.Status == "ACCEPTED") || (Registration.Status == "NOT_ACCEPTED") )
        {
            const errorObject = {
                message: 'Status is not correct.',
                code: 500
            }
            next(errorObject);
        }

        // Check if reservation is made by user Id
        database.dbQuery(queryCheck, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{

                if(rows == 0)
                {
                    const errorObject = {
                        message: 'You are not authorized to update the reservation or object does not exist.',
                        code: 401
                    }
                    next(errorObject);
                }
                else{

                    database.dbQuery(queryUpdate, (err, rows) => {

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
        })
    },

    deleteReservationByAppartment:  (req, res, next) => {

        console.log("updateReservationStatus");

        const id = req.params.id;
        const rid = req.params.rid;
        const userId = req.userId;

        const query = `DELETE FROM Reservation WHERE Reservation.reservationId = ${rid} AND Reservation.apartmentId = ${id} AND Reservation.UserId = ${userId}`;

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