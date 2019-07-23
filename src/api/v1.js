'use strict';
/** 
 * This file is to retrive request from the client send them to corronsponing models
 * It will also send respons back to the client once the request is completed 
 * Or send an error if their a sever or page not found.
*/

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

router.param('model', modelFinder.load);

router.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});

router.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);
router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

// Route Handlers

/**
 *This is a function that get all the data based on the request the client send.
 * It will then go to the corrensponding request models to reponse to the request.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 *This is a fuction that get one item based off of the id of the request the client send.
 * It will go to the corrensponding folder in the model folder and respone with the item that was requested.
 * @param {id} request
 * @param {*} response
 * @param {*} next
 */
function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 *This function will create a new instant based off of the client request.
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *This function will update or create a new instant based off of the client request. 
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *This function will delete based off of the client response.
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;
