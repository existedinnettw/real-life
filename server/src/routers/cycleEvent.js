const express = require('express');
const bodyParser = require('body-parser')
const usersModel = require('../model/users')
const cycleEventsModel= require('../model/cycleEvents')


let cycleEventRouter= express.Router()
cycleEventRouter.use(bodyParser.json())

/*************************************Events**********************************/
cycleEventRouter.get('/cycleEvents' ,function(req, res, next){ // isAuthenticated middleware already apply at server.js
    const email=req.user.emails[0].value //get email from several emails
    //console.log('in cycleEvents api:', email)  
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const serchText= req.query.serchText
        cycleEventsModel.list( serchText,userID).then(cycleEvents=>{
            res.json(cycleEvents) //return cycleEvents
        })
        
    }).catch(next) //to error handle

})
cycleEventRouter.post('/cycleEvents', function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        // console.log(req.query) //for get only
        // console.log(req.params) //for get only
        // console.log(req.body)
        const {summary, init_cron, due_cron, target, purpose, expect_time}= req.body
        cycleEventsModel.create(summary, init_cron, due_cron, target, purpose, expect_time, userID ).then(cycleEvents=>{
            res.json(cycleEvents) //return cycleEvents
        })
        
    }).catch(next) //to error handle
})
cycleEventRouter.put('/cycleEvents/:id',function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const {id} = req.params;
        // console.log(req.body)
        cycleEventsModel.update(id, userID, req.body ).then(cycleEvents=>{
            res.json(cycleEvents) //return cycleEvents
        })
        
    }).catch(next) //to error handle
})
cycleEventRouter.delete('/cycleEvents/:id', function(req,res,next){
    const email=req.user.emails[0].value
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const {id} = req.params;
        // console.log(id,userID)
        cycleEventsModel.deleteSQL(id, userID ).then(cycleEvents=>{
            res.json(cycleEvents) //return cycleEvents
        })
        
    }).catch(next) //to error handle
})


cycleEventRouter.get('/cycleEvents' ,function(req, res, next){
    const email=req.user.emails[0].value 
    usersModel.list(email).then(rst=>{
        const userID= rst.id
        const serchText= req.query.serchText
        cycleEventsModel.list(serchText,userID).then(cycleEvents=>{
            res.json(cycleEvents)
        })
    }).catch(next) //to error handle
})

module.exports= {
    cycleEventRouter
}