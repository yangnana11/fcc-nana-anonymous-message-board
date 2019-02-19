/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

module.exports = function (app) {
  const replySchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    created_on: {
      type: Date,
      default: Date.now
    },    
    delete_password: {
      type: String,
      required: true
    },
    reported: {
      type: Boolean,
      default: false
    }
  });
  const threadSchema = new mongoose.Schema({
    board: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    delete_password: {
      type: String,
      required: true
    },
    created_on: {
      type: Date,
      default: Date.now
    },
    bumped_on: {
      type: Date,
      default: Date.now
    },
    replies: {
      type: [replySchema],
      default: []
    },
    replycount: {
      type: Number,
      default: 0
    },
    reported: {
      type: Boolean,
      default: false
    }
  }, {
    versionKey: false // You should be aware of the outcome after set to false
  });
  var Thread = mongoose.model('Thread', threadSchema);
  app.route('/api/threads/:board')
  .get(function(req, res) {   
    // console.log(req.params);
    const query = Thread.find({board: req.params.board});
    query.select('-reported -delete_password -replies.delete_password -replies.reported')
    .sort({bumped_on: -1 })
    .limit(3)
    .exec((err,result) => {err ? res.json(err) : res.json(result)});    
  })
  .post(function(req, res) {
    // console.log(req.params);
    // console.log(req.body);
    let thread = new Thread({
      board: req.params.board,
      text: req.body.text,
      delete_password: req.body.delete_password
    });
    thread.save((err,result) => {
      if (err) {
        res.json(err);
      } else {
        res.redirect('/b/'+req.params.board);
      }
    });
  })
  .put(function(req, res) {
    if (req.body.thread_id == undefined) {
      res.status(500);
      res.json({result: 'fail'});
    } else {
      Thread.findOneAndUpdate({board: req.params.board, _id: req.body.thread_id}, {bumped_on: new Date().toISOString(), reported: true}, (err, result) => {
        if (err) {        
          res.json({result: 'fail'});
        } else {        
          res.json({result: 'success'});        
        }
      });
    }
  })
  .delete(function(req,res){
    if (req.body.thread_id == undefined || req.body.delete_password == undefined) {
      res.status(500);
      res.json({result: 'fail'});    
    } else {
      Thread.findOneAndDelete({board: req.params.board, _id: req.body.thread_id, delete_password: req.body.delete_password}, (err, result) => {
        if (err) {    
          res.status(404);
          res.json({err});
        } else {        
          res.status(200);
          res.json({result: 'success'});        
        }
      });
    }
    
  });
    
  app.route('/api/replies/:board')
  .get(function(req, res) {    
    if (req.query.thread_id == undefined) {
      res.status(500);
      res.json({message: 'Missing Thread ID'});
    } else {
      const query = Thread.findOne({board: req.params.board, _id: req.query.thread_id});
      query.select('-reported -delete_password')
      .limit(3)
      .exec((err,result) => {
        if (err) {
          res.json(err);
        } else {            
          res.json(result);
        }
      });    
    }
  })
  .post(function(req, res) {
    if (req.body.thread_id == undefined || req.body.text == undefined || req.body.delete_password == undefined){
      res.status(500);
      res.json({message: 'Missing required parameter(s)'});
    } else {
      Thread.findOneAndUpdate({board: req.params.board, _id: req.body.thread_id}, {bumped_on: new Date().toISOString(), $push: { replies: {text: req.body.text, delete_password: req.body.delete_password} }}, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.redirect('/b/'+req.params.board+'/'+req.body.thread_id);
        }
      });
    }
  })
  .put(function(req, res) {   
    if (req.body.thread_id == undefined || req.body.reply_id == undefined) {
      res.status(500);
      res.json({result: 'Missing parameter(s)'});
    } else {
      Thread.updateOne({board: req.params.board, _id: req.body.thread_id, 'replies._id': req.body.reply_id}, 
                  {
                    bumped_on: new Date().toISOString(),
                    $set: {'replies.$.reported': true}
                  }, (err, result) => {
        if (err) {        
          res.json({result: 'fail'});
        } else {        
          res.json({result: 'success'});        
        }
      });    
    }
  })
  .delete(function(req, res) {
    if (req.body.thread_id == undefined || req.body.reply_id == undefined || req.body.delete_password == undefined) {
      res.status(500);
      res.json({result: 'Missing parameter(s)'});
    } else {
      Thread.updateOne( {board: req.params.board, _id: req.body.thread_id, replies: {$elemMatch: {_id: req.body.reply_id, delete_password: req.body.delete_password}}}, 
                  { $pull: { replies: { _id: req.body.reply_id } } }, (err, result) => {
        if (err) {             
          res.json({result: 'fail'});
        } else {        
          res.json({result: 'success'});        
        }
      });
    }
  });
};
