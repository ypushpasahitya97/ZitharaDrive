const client = require('./connection.js')
const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})

client.connect();

//get
app.get('/customer', (req, res)=>{
    client.query(`Select * from customer`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


//post
app.post('/customer', (req, res)=> {
    const customer = req.body;
    let insertQuery = `insert into customer(SNO, CUSTOMER_NAME, AGE, PHONE,LOCATION,CREATED_AT) 
                       values(${customer.SNO}, '${customer.CUSTOMER_NAME}', '${customer.AGE}', '${customer.PHONE}', '${customer.LOCATION}', '${customer.CREATED_AT}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})