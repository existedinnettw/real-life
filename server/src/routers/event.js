const express = require('express');
const bodyParser = require('body-parser')
const {isAuthenticated} = require('./auth')
const eventsModel = require('../model/events')
const usersModel = require('../model/users')


let eventRouter= express.Router()

eventRouter.use(bodyParser.json())

//list, the real api to perform
eventRouter.get('/events',isAuthenticated ,function(req, res, next){
    const email=req.user.emails[0].value //get email from several emails
    //console.log('in events api:', email)  
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        eventsModel.list('',userID).then(events=>{
            res.json(events) //return events
        })
        
    }).catch(next) //to error handle

})


module.exports= {
    eventRouter
}