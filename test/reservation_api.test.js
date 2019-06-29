const chai = require('chai');
const chaiHttp = require('chai-http');
const util = require("util");
const server = require('../app');

chai.should();
chai.use(chaiHttp)

describe('Testing /api/appartments/x/reservations', () => {
    
    var token = null;

    before(function(done) { chai
        .request(server)
          .post('/api/login')
          .send({ "EmailAddress" : 'bob@marley.com', "Password" : 'secret' })
          .end(function(err, res) {
            token = res.token;
            done();

            token = res.body.result.token;

          });
      });

  /**
   * Valid GET /api/appartments/x/reservations
   */
  it('Should return all reservations for given appartment.', done => {
    chai
      .request(server)
      .get('/api/appartments/370/reservations')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;
        res.should.have.status(200)

        result.should.have
                    .property('Result')
                    .that.is.a('array')
        done()
      })
  })

  /**
   * Invalid GET /api/appartments/x/reservations
   */
  it('Should throw error: Appartment does not exist', done => {
    chai
      .request(server)
      .get('/api/appartments/0/reservations')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)


        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Appartment does not exist.')
        done()
      })
  })

  /**
   * Invalid GET /api/appartments/x/reservations
   */
  it('Should throw error: Appartment does not exist', done => {
    chai
      .request(server)
      .get('/api/appartments/0/reservations')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Appartment does not exist.')
        done()
      })
  })

 /**
   * Valid GET /api/appartments/x/reservations/x
   */
  it('Should succeed: Reservation should be returned.', done => {
    chai
      .request(server)
      .get('/api/appartments/431/reservations/101')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(200)

        result.should.have
                    .property('Result')
                    .that.is.a('array')
        done()
      })
  })

   /**
   * Invalid GET /api/appartments/x/reservations/x
   */
  it('Should throw error: Appartment ID is incorrect.', done => {
    chai
      .request(server)
      .get('/api/appartments/0/reservations/101')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Appartment does not exist.')
        done()
      })
  })

  /**
   * Invalid GET /api/appartments/x/reservations/x
   */
  it('Should throw error: Reservation ID is incorrect.', done => {
    chai
      .request(server)
      .get('/api/appartments/431/reservations/0')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Reservation does not exist.');
        done()
      })
  })

   /**
   * Valid PUT /api/appartments/x/reservations/x
   */
  it('Should succeed: Reservation should be adjusted.', done => {
    chai
      .request(server)
      .put('/api/appartments/431/reservations/101')
      .send({
        "Status" : "INITIAL"
      })
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;
        res.should.have.status(200)

        res.body.should.be.a('object');

        done()
      })
  })

  /**
   * Invalid PUT /api/appartments/x/reservations/x
   */
  it('Should throw error: appartment ID does not exist.', done => {
    chai
      .request(server)
      .put('/api/appartments/0/reservations/101')
      .send({
        "Status" : "INITIAL"
      })
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Appartment does not exist.');
        done()
      })
  })

  /**
   * Invalid PUT /api/appartments/x/reservations/x
   */
  it('Should throw error: reservation ID does not exist.', done => {
    chai
      .request(server)
      .put('/api/appartments/431/reservations/0')
      .send({
        "Status" : "INITIAL"
      })
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Reservation does not exist.');
        done()
      })
  })

  /**
   * Invalid PUT /api/appartments/x/reservations/x
   */
  it('Should throw error: Caller is not the owner of the reservation.', done => {
    chai
      .request(server)
      .put('/api/appartments/370/reservations/103')
      .send({
        "Status" : "INITIAL"
      })
      .set('Authorization', token)
      .end((err, res) => {
          
             result = res.body;

             res.should.have.status(401)
     
             result.should.be.a('object')
             result.should.have.property('code')
                     .that.is.a('number')
                     .equals(401);
     
             result.should.have
                         .property('message')
                         .that.is.a('string')
                         .equals('Caller is not the owner of the appartment.');
             done()
      })
  })

  /**
   * Invalid DELETE /api/appartments/x/reservations/x
   */
  it('Should throw error: Appartment does not exist.', done => {
    chai
      .request(server)
      .delete('/api/appartments/0/reservations/103')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Appartment does not exist.')
        done()
      })
  })

  /**
   * Invalid DELETE /api/appartments/x/reservations/x
   */
  it('Should throw error: Reservation does not exist.', done => {
    chai
      .request(server)
      .delete('/api/appartments/370/reservations/0')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(404)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(404);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Reservation does not exist.');
        done()
      })
  })

  /**
   * Invalid DELETE /api/appartments/x/reservations/x
   */
  it('Should throw error: Owner does not own reservation.', done => {
    chai
      .request(server)
      .delete('/api/appartments/370/reservations/150')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(401)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(401);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Caller is not the owner of the reservation.');
        done()
      })
  })
})