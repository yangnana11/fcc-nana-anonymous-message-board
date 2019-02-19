/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'abcde',
          delete_password: '12345'
        })
        .end(function(err, res){          
          assert.equal(res.status, 200);
          
          //fill me in too!
          
          done();
        });
      });            
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'abcde'          
        })
        .end(function(err, res){              
          assert.equal(res.status, 200);
          assert.property(res.body, 'errors');
          //fill me in too!
          
          done();
        }); 
      });
    });
    
    suite('GET', function() {
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/threads/test')
        .query({})
        .end(function(err, res){                    
          assert.equal(res.status, 200);
          assert.isArray(res.body); 
          assert.isAtMost(res.body.length, 3);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'board');
          assert.property(res.body[0], 'text');          
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'replies');          
          assert.notProperty(res.body[0], 'delete_password');
          assert.notProperty(res.body[0], 'reported');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Missing parameters', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({          
        })
        .end(function(err, res){            
          assert.equal(res.status, 500);          
          done();
        });
      });            
      
      test('Full parameters', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: '5c6a659fa3b063294c109d5d',
          delete_password: '12345'
        })
        .end(function(err, res){            
          assert.equal(res.status, 200);          
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('No body', function(done) {
        chai.request(server)
        .put('/api/threads/test')
        .end(function(err,res) {          
          assert.notEqual(res.status, 200);
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/threads/test')
        .send({
          thread_id: '5c628ce8b5cf6c5917a8d818'          
        })
        .end(function(err,res) {          
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/replies/test')
        .send({
          text: 'abcde',
          thread_id: '5c6a78602e62f361e45393a1',
          delete_password: '12345'
        })
        .end(function(err, res){          
          assert.equal(res.status, 200);
          
          //fill me in too!
          
          done();
        });
      });            
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({
          text: 'abcde'          
        })
        .end(function(err, res){              
          assert.equal(res.status, 500);          
          //fill me in too!
          
          done();
        }); 
      });
    });
    
    suite('GET', function() {
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({})
        .end(function(err, res){                    
          assert.equal(res.status, 500);          
          done();
        });
      });
      test('Has filter', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: '5c6a78602e62f361e45393a1'})
        .end(function(err, res){               
          assert.equal(res.status, 200);          
          assert.property(res.body, '_id');
          assert.property(res.body, 'board');
          assert.property(res.body, 'text');          
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'replies');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('No body', function(done) {
        chai.request(server)
        .put('/api/replies/test')
        .end(function(err,res) {          
          assert.notEqual(res.status, 200);
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/replies/test')
        .send({
          thread_id: '5c628ce8b5cf6c5917a8d818',
          reply_id: '5c628ce8b5cf6c5917a8d818'
        })
        .end(function(err,res) {          
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Missing parameters', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({          
        })
        .end(function(err, res){            
          assert.equal(res.status, 500);          
          done();
        });
      });            
      
      test('Full parameters', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: '5c6a659fa3b063294c109d5d',
          reply_id: '5c6a659fa3b063294c109d5d',
          delete_password: '12345'
        })
        .end(function(err, res){            
          assert.equal(res.status, 200);          
          done();
        });
      });
    });
    
  });

});
