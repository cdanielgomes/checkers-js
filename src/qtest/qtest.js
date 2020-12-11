'use strict'

import { response } from "express";

let axios = require("axios")
let qs = require("querystring")
let dot_env = require('dotenv');
dot_env.config({path: `${__dirname}/.env`})
axios.defaults.adapter = require('axios/lib/adapters/http');

export const login = async () => {
    let configuration =  {
        headers : {
        "Authorization": process.env.AUTHORIZATION,
        "Content-Type": "application/x-www-form-urlencoded"
        }   
    }
    let params = {
        "grant_type": "password",
        "password": process.env.PASSWORD,
        "username": process.env.USERNAME
    }
  
    let url = `https://${process.env.ID}.qtestnet.com/oauth/token`
    
    try{
        let answer = await axios.post(url, qs.stringify(params), configuration)
    
        if (answer.status === 200) {
            process.env.TOKEN = `${answer.data.token_type} ${answer.data.access_token}`
            return true
        
        }
    }catch (error){
        let res  = error.response
        if(res){
            console.error("Status: " + res.status)
            console.error(": " + res.data.error_description)    
        } else{
            console.error(error)
        }
    }
    return false
}


export const sendData = async ({id, status, beginTime, endTime}) => {
    if(process.env.TOKEN){
    let data = {
        status:{"id":status},
        exe_start_date: beginTime,
        exe_end_date: endTime
    }

    let config = {
        method: 'post',
        url: `https://${process.env.ID}.qtestnet.com/api/v3/projects/${process.env.PROJECT_ID}/test-runs/${id}/test-logs`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': process.env.TOKEN, 
            'Cache-Control': 'no-cache'
        },
        data
    }

    axios(config)
        .then((response) => {
            if(response.status === 200){
                console.log(response.data)
            }
        })  
        .catch((error)  => {
            let res  = error.response
            if(res){
            console.log("Error code: " + res.status)
            console.log("ERROR: " +  JSON.stringify(res.data)) 
        } else console.error(error)
    })

   } else {
       if (await login()){
           sendData(id, status, beginTime, endTime)
       } else {
           console.log("ERROR LOGGING IN ")
       }
   }
}


