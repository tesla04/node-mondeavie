"use strict";

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../../utils/utils');

function validatePresenceOf (value) {
  if(typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      value = value.toString().trim();
  }
  return !!(value && value.length);
}


// 2016-04-17T00:01:00.000Z
function validateDate(value) {
  var isoValue = value.toISOString();
  var utcDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/;
  var isValid = utcDateRegex.test(isoValue);
  return isValid;
}



var testingDaysSchema = new Schema({
  "slug" : String,
  "day" : {
    type: Date, 
    //validate: [validatePresenceOf, "Le date est invalide"],
    //required: [true, "Le date est requis"]
  },
  "isFull": Boolean
});

var SchedulesSchema = new Schema({
  "slug" : String,
  "isFull": Boolean,
  "dayEnd" : {
    type: Date, 
    validate: [validateDate, "Le date de fin est invalide"],
    required: [true, "Le date de fin est requis"]
  },
  "dayStart" : {
    type: Date, 
    validate: [validateDate, "Le date de départ est invalide"],
    required: [true, "Le date de départ est requis"]
  },
  "dayName": String,
  "testingDays": [ testingDaysSchema ]
});

var courseTypesSchema = new Schema({
  "slug" : String,
  "name" : {
    type: String, 
    validate: [validatePresenceOf, "Le titre est invalide"],
    required: [true, "Le titre est requis"]
  },
  "description": String,
  "schedules": [ SchedulesSchema ]
});

var CourseSchema = new Schema({
  "slug" : String,
  "courseType" : {
    type: String, 
    validate: [validatePresenceOf, "Le type est invalide"],
    required: [true, "Le type est requis"]
  },
  "note": String,
  "image": {
    url: String
  },
  "description": String,
  "price": String,
  "isVisible": Boolean,
  "courseTypes": [ courseTypesSchema ]
});


var TeachersSchema = new Schema({
  "slug" : String,
  "firstName" : {
    type: String, 
    validate: [validatePresenceOf, "Le prénom est invalide"],
    required: [true, "Le prénom est requis"]
  },
  "lastName" : {
    type: String, 
    validate: [validatePresenceOf, "Le nom est invalide"],
    required: [true, "Le nom est requis"]
  },
  "tel" : {
    type: String, 
    //validate: [validatePresenceOf, "Le téléphone est invalide"],
    //required: [true, "Le téléphone est requis"]
  },
  "schoolName" : {
    type: String, 
    //validate: [validatePresenceOf, "Le nom d école est invalide"],
    //required: [true, "Le nom d école est requis"]
  },
  "schoolUrl" : {
    type: String,
    //validate: [validatePresenceOf, "L adresse url de l école est invalide"],
    //required: [true, "L adresse url de l école est requis"]
  },
  "course": CourseSchema
});

var CourseSchemaEmbed = Schema({
  "slug" : String,
  "name" : {
    type: String, 
    validate: [validatePresenceOf, "Le nom est invalide"],
    required: [true, 'Le nom est requis']
  },
  "svg": {
    type: String, 
    //validate: [validatePresenceOf, "Le svg est invalide"],
    //required: [true, 'Le svg est requis']
  },
  "teachers" : [ TeachersSchema ]
}); // courseSchema


// Hook on save method that create the slugs
CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  utils.slugify(this);
  next();
});

CourseSchemaEmbed.pre('validate', function(next){
    console.log("pre validate called");
    //console.log('this', this);
    next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Course', CourseSchemaEmbed);