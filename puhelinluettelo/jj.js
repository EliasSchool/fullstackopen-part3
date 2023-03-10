const express = require('express');
const app = express();
app.use(express.json());
console.log("Hello World");


let persons = [
        { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
        },
        { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
        },
        { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
        },
        { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
        }
    ]

app.get("/info", (req, res) => {
    const date  = new Date()
    res.send(`
        <div> 
            <p>Phonebook has info for ${persons.length} persons</p>
        <div/> 
        <div>
            <p>${date}</p>
            <div/> `
        );
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id) 
    const person = persons.find(p => p.id === id)
    if(person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
}) 

app.get("/api/persons", (req, res) => {
    res.send(persons);
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id) 
    const person = persons.find(p => p.id === id)

    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const person = req.body
    console.log(person)
    res.json(person)
});


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 