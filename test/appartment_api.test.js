const chai = require('chai');
const chaiHttp = require('chai-http');
const util = require("util");
const server = require('../app');

chai.should();
chai.use(chaiHttp)

describe('Testing /api/appartment', () => {
    
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
   * Valid POST /api/appartments
   */
  it('Should give status 200 and return appartment + new owner JSON.', done => {
    chai
      .request(server)
      .post('/api/appartments')
      .send({
        Description: 'test_apartment',
        StreetAddress: "test_address",
        PostalCode: "4703kb",
        City : "test_city"
      })
      .set('Authorization', token)
      .end((err, res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      })
  })


  /**
   * Bad POST /api/appartments
   */
  it('Should throw error: API should return status code 500 due to postal code being invalid.', done => {
    chai
      .request(server)
      .post('/api/appartments')
      .send({
        Description: 'test_apartment',
        StreetAddress: "test_address",
        PostalCode: "470akb",
        City : "test_city"
      })
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));

        result = res.body;

        res.should.have.status(500)
        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(500);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Postal Code is not valid.')
        done()
      })
  })

  /**
   * Bad POST /api/appartments: Mandatory fields are missing 
   */
  it('Should throw error: API should return status code 500 due to mandatory fields missing.', done => {
    chai
      .request(server)
      .post('/api/appartments')
      .send({
        Description: 'test_apartment'
          })
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(500)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(500);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('One or more mandatory fields are empty.')

        done()
      })
  })

  /**
   * Valid PUT /api/appartments
   */
  it('Should return adjusted appartment.', done => {
    chai
      .request(server)
      .put('/api/appartments/431')
      .send({
        "Description" : "Mooi appartement",
        "UserId" : "1",
        "StreetAddress": "Lavadijk 142",
        "PostalCode" : "4706kv",
        "City" : "Roosendaal"
          })
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(200)

        result.should.have
                    .property('result')
                    .that.is.a('object')
        done()
      })
  })


  /**
   * Invalid PUT /api/appartments
   */
  it('Should throw error: Postal code is invalid', done => {
    chai
      .request(server)
      .put('/api/appartments/431')
      .send({
        "Description" : "Mooi appartement",
        "UserId" : "1",
        "StreetAddress": "Lavadijk 142",
        "PostalCode" : "470600",
        "City" : "Roosendaal"
          })
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(500)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(500);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Postal Code is not valid.')
        done()
      })
  })


/**
   * Invalid PUT /api/appartments
   */
  it('Should throw error: All fields are empty.', done => {
    chai
      .request(server)
      .put('/api/appartments/431')
      .send({})
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
        result = res.body;

        res.should.have.status(500)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(500);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Object is empty.')
        done()
      })
  })


/**
   * Invalid PUT /api/appartments
   */
  it('Should throw error: Appartment does not exist.', done => {
    chai
      .request(server)
      .put('/api/appartments/0')
      .send({})
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
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
   * Invalid PUT /api/appartments
   */
  it('Should throw error: Caller is not authorized.', done => {
    chai
      .request(server)
      .put('/api/appartments/370')
      .send({
        "Description" : "Mooi appartement",
        "UserId" : "1",
        "StreetAddress": "Lavadijk 142",
        "PostalCode" : "4706kb",
        "City" : "Roosendaal"
          }).set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
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
   * Valid GET /api/appartments
   */
  it('Should return all appartments.', done => {
    chai
      .request(server)
        .get('/api/appartments')
      .send()
      .set('Authorization', token)
      .end((err, res) => {

        result = res.body;
        res.should.have.status(200)

        result.should.have
                    .property('result')
                    .that.is.a('array')
        done()
      })
  })

  /**
   * Valid GET /api/appartment/id
   */
  it('Should return an appartment.', done => {
    chai
      .request(server)
      .get('/api/appartments/370')
      .send()
      .set('Authorization', token)
      .end((err, res) => {

        // console.log(util.inspect(res));
        result = res.body;
        res.should.have.status(200)

        result.should.have
                    .property('result')
                    .that.is.a('array')
        done()
      })
  })

  /**
   * Invalid GET /api/appartment/x
   */
  it('Should throw error: Appartment does not exist.', done => {
    chai
      .request(server)
      .get('/api/appartments/0')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        // console.log(util.inspect(res));
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
   * Invalid DELETE /api/appartments/x
   */
  it('Should throw error: Appartment does not exist.', done => {
    chai
      .request(server)
      .delete('/api/appartments/0')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        // console.log(util.inspect(res));
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
   * Invalid DELETE /api/appartments/x
   */
  it('Should throw error: Appartment does not exist.', done => {
    chai
      .request(server)
      .delete('/api/appartments/372')
      .send()
      .set('Authorization', token)
      .end((err, res) => {
          
        // console.log(util.inspect(res));
        result = res.body;
  
        res.should.have.status(401)

        result.should.be.a('object')
        result.should.have.property('code')
                .that.is.a('number')
                .equals(401);

        result.should.have
                    .property('message')
                    .that.is.a('string')
                    .equals('Caller is not the owner of the appartment.')
        done()
      })
  })
})


