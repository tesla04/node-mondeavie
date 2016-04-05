"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');

var dbUtils =                   require('../utils/db');

function _getObj(course, obj_id){
  if( obj_id ) {
    return course.teachers.id( obj_id );
  }
  return course.teachers[ course.teachers.length -1 ];
}

module.exports = function () {

  var functions = {};

/*
        course.save(function(err, course){
          // return only the teacher added
          if( err ) {
            res.status(400);
            res.json( err );
          } else {
            let teacher = course.teachers[ course.teachers.length -1 ];
            res.json(teacher);
          }
        });
*/
  functions.create = function(req, res){

    let course_id = req.params.course_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = req.body;
        course.teachers.push(teacher);
        dbUtils.saveCourse(course, res, teacher._id, _getObj);
      }, (err) => {
        // course not found
        res.json(err);
      });

  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params._id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        res.json(teacher);
      }, (err) => {
        res.json(err);
      });

  }

  functions.update = function(req, res){

    let course_id = req.params.course_id;
    let teacher_id = req.params._id;
    let json = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        dbUtils.updateAttributes(teacher, json);
        dbUtils.saveCourse(course, res, teacher._id, _getObj);
      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params._id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        course.teachers.pull(teacher_id)
        course.save(function(err, course){
          res.json({
            'status': 'deleted',
            '_id' : teacher_id
          });
        });
      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    let course_id = req.params.course_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teachers = course.teachers;
        res.json(teachers);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
