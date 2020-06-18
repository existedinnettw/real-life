const express = require('express');
const bodyParser = require('body-parser')
const {isAuthenticated} = require('./auth')
const usersModel = require('../model/users')
const eventsModel = require('../model/events')
const cycleEventsModel= require('../model/cycleEvents')
const todayEventsModel= require('../model/todayEvents')


let eventRouter= express.Router()

eventRouter.use(bodyParser.json())

//list, the real api to perform

/*************************************Events**********************************/
eventRouter.get('/events' ,function(req, res, next){ // isAuthenticated middleware already apply at server.js
    const email=req.user.emails[0].value //get email from several emails
    //console.log('in events api:', email)  
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const serchText= req.query.serchText
        eventsModel.list( serchText,userID).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle

})
eventRouter.post('/events', function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        // console.log(req.query) //for get only
        // console.log(req.params) //for get only
        // console.log(req.body)
        const {summary, initTime, dueTime, target, purpose, expectTime}= req.body
        eventsModel.create(summary, initTime, dueTime, target, purpose, expectTime, userID ).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle
})
eventRouter.delete('/events/:id', function(req,res,next){
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const {id} = req.params;
        eventsModel.create(summary, initTime, dueTime, target, purpose, expectTime, userID ).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle
})

/*************************************cycleEvents**********************************/
eventRouter.get('/cycleEvents' ,function(req, res, next){
    const email=req.user.emails[0].value 
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const serchText= req.query.serchText
        cycleEventsModel.list(serchText,userID).then(events=>{
            res.json(events)
        })
    }).catch(next) //to error handle
})

/*************************************todayEvents**********************************/
eventRouter.get('/todayEvents' ,function(req, res, next){
    const email=req.user.emails[0].value 
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        todayEventsModel.list(userID).then( todayEvents=>{
            //search all the events by the getted event ids
            //eventsModel.list()
            res.json(todayEvents) 
        })
    }).catch(next)
})


module.exports= {
    eventRouter
}