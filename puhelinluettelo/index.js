require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Contacts = require('./models/contact');
app.use(cors());
app.use(express.json());
app.use(express.static('build')); 
console.log("Hello World");

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms', 
        JSON.stringify(req.body),
    ].join(' ');
}))



app.get("/info", (req, res, next) => {
    const date  = new Date()
    Contacts.find().then(contacts => {
        if (contacts){
            res.send(`
            <div> 
            <p>Phonebook has info for ${contacts.length} persons</p>
            <div/> 
            <div>
            <p>${date}</p>
            <div/> `
            );
        } else {
            res.status(404).end()
        }
    }) 
    .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Contacts.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error)) 
}) 

app.get("/api/persons", (req, res, next) => {
    Contacts.find().then(persons => {
        if(persons) {
            res.json(persons)
        } else {
            res.status(404).end()
        }
    }) 
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Contacts.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }) 
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body
    
    if(!body.name ||!body.number) {
        return res.status(400).json({ error: "Missing name or person" })
    } 
    
    const contact = new Contacts({
        name : body.name,
        number : body.number,
    }) 
    
    contact.save()
        .then(savedPerson => res.json(savedPerson)) 
        .catch(error => next(error))
    }) 

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body
    const contacts = {
        name : body.name,
        number : body.number,
    } 

    Contacts.findByIdAndUpdate(req.params.id, contacts, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        }) 
        .catch(error => next(error)) 
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.log(error.message, "sselvä")
    console.log("ookoo")
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError' || error.name === 'ReferenceError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)    
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 