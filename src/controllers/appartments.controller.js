const database = require('../datalayer/mssql.dao');
const postalcodeValidator = new RegExp('^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$');

module.exports = {

    getAllAppartments: (req, res, next) => {
        
        console.log("getAllAppartments called");

        const query = `select a.*, u.firstname, u.lastname, r.startdate, r.enddate, r.status
        from apartment as a
            join dbuser as u on u.userid = a.userid
            join reservation as r on r.apartmentid = a.apartmentid`;

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

        // Check if fields are present
        if(!appartment.hasOwnProperty("City") || !appartment.hasOwnProperty("PostalCode") || !appartment.hasOwnProperty("StreetAddress"))
        {
            errorObject = {
                message : 'One or more mandatory fields are empty.',
                code : 500
              } 
    
              next(errorObject);
              return;
        }

        // Check if postalcode is valid
        if(postalcodeValidator.test(appartment.PostalCode) != true)
        {
          errorObject = {
            message : 'Postal Code is not valid.',
            code : 500
          } 

          next(errorObject);
          return;
        }

        const query = `INSERT INTO Apartment VALUES('${appartment.Description}', '${appartment.StreetAddress}', '${appartment.PostalCode}', '${appartment.City}', ${userId} ); SELECT SCOPE_IDENTITY() AS id;`;

        console.log(query);

        database.dbQuery(query, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                res.status(200).json({"Description" : appartment.Description, "StreetAddress" : appartment.StreetAddress, "PostalCode" : appartment.PostalCode, "City" : appartment.City, "userId" : userId, "ApartmentId" : rows[0].id} );
            }
        })
    },

    getAppartment: (req, res ,next) => {
        console.log("getAppartment called");

        const id = req.params.id;
        //const query = `SELECT * FROM Apartment INNER JOIN DBUser ON Apartment.UserId = DBUser.UserId INNER JOIN Reservation ON Reservation.ApartmentId = Apartment.ApartmentId WHERE Apartment.ApartmentId=${id}`;
        const query = `select a.*, u.firstname, u.lastname, r.startdate, r.enddate, r.status
        from apartment as a
            join dbuser as u on u.userid = a.userid
            join reservation as r on r.apartmentid = a.apartmentid
        where a.ApartmentId=${id}`;

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
                        message: 'Appartment does not exist.',
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

        // Check if object is empty
        if(Object.keys(appartment).length === 0)
        {
            errorObject = {
                message : 'Object is empty.',
                code : 500
              } 
    
              next(errorObject);
              return;
        }

        // Check if postalcode is valid
        if(postalcodeValidator.test(appartment.PostalCode) != true)
        {
          errorObject = {
            message : 'Postal Code is not valid.',
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

    deleteAppartment: (req, res, next) => {
        
        console.log("deleteAppartment");

        const id = req.params.id;
        const queryDelete = `DELETE FROM Reservation WHERE ApartmentId=${id};DELETE FROM Apartment WHERE Apartment.ApartmentId=${id}`;

        database.dbQuery(queryDelete, (err, rows) => {

            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }
                next(errorObject);
            }else{
                console.log();

                res.status(200).json(req.appartment);
            }
        });
    },

    createReservation: (req, res, next) => {

        const id = req.params.id;
        const reservation = req.body;
        const userId = req.userId;

        const query = `INSERT INTO Reservation VALUES(${id}, '${reservation.StartDate}', '${reservation.EndDate}', '${reservation.Status}', ${userId});  SELECT SCOPE_IDENTITY() AS id;`;

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
                res.status(200).json({"ReservationId" : rows[0].id});
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

                if(rows == 0)
                {
                    const errorObject = {
                        message: 'Appartment does not exist.',
                        code: 404
                    }
                    next(errorObject);       
                }
                else{
                    res.status(200).json({Result: rows});
                }
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

    },

    checkAppartment: (req, res ,next) => {
        console.log("checkAppartment called");

        const id = req.params.id;
        const query = `SELECT * FROM Apartment WHERE ApartmentId=${id}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }

                return res.status(500).json(errorObject);

            }            
            else{

                // Check if appartment exists
                if(rows.length == 0)
                {
                    const errorObject = {
                        message: 'Appartment does not exist.',
                        code: 404
                    }

                    return res.status(404).json(errorObject);

                }
                else{

                    req.appartment = rows;
                    next();
                }
            }

        });
    },

    checkOwner: (req, res ,next) => {
        console.log("checkOwner called");
        console.log(req.userId);

        const id = req.params.id;
        const userId = req.userId;
        
        const query = `SELECT UserId FROM Apartment WHERE ApartmentId=${id}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }

                return res.status(500).json(errorObject);
                
            }            
            else{

                // Check if user id is the same
                if(userId == rows[0].UserId)
                {
                    next();
                }
                else{
                    const errorObject = {
                        message: 'Caller is not the owner of the appartment.',
                        code: 401
                    }

                    return res.status(401).json(errorObject);
                }
            }

        });
    },

    checkReservationOwner: (req, res ,next) => {
        console.log("checkReservationOwner called");
        console.log(req.userId);

        const id = req.params.id;
        const userId = req.userId;
        const rid = req.params.rid;

        const query = `SELECT UserId FROM Reservation WHERE ReservationId=${rid}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }

                return res.status(500).json(errorObject);
                
            }            
            else{

                // Check if user id is the same
                if(userId == rows[0].UserId)
                {
                    next();
                }
                else{
                    const errorObject = {
                        message: 'Caller is not the owner of the reservation.',
                        code: 401
                    }

                    return res.status(401).json(errorObject);
                }
            }

        });
    },

    checkReservation: (req, res ,next) => {
        console.log("checkReservation called");

        const rid = req.params.rid;
        const id = req.params.id;
        
        const query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId = ${id} AND Reservation.ReservationId = ${rid}`;

        database.dbQuery(query, (err, rows) => {
            if(err){
                const errorObject = {
                    message: 'Error',
                    code: 500
                }

                return res.status(500).json(errorObject);

            }            
            else{

                // Check if reservation exists
                if(rows.length == 0)
                {
                    const errorObject = {
                        message: 'Reservation does not exist.',
                        code: 404
                    }

                    return res.status(404).json(errorObject);

                }
                else{

                    req.reservation = rows;
                    next();
                }
            }

        });
    }
}