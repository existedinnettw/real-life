const express = require('express');
const bodyParser = require('body-parser')
const {isAuthenticated} = require('./auth')
const usersModel = require('../model/users')
const eventsModel = require('../model/events')

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
        // const {summary, init_time, due_time, target, purpose, expectTime}= req.body
        eventsModel.create(userID, req.body ).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle
})
eventRouter.put('/events/:id',function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const {id} = req.params;
        // console.log(req.body)
        eventsModel.update(id, userID, req.body ).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle
})
eventRouter.delete('/events/:id', function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const {id} = req.params;
        eventsModel.deleteSQL(id, userID ).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle
})



module.exports= {
    eventRouter
}