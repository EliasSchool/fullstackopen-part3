const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
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




const generateID = () => {
    const maxID = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 0 
    return maxID 
} 
    

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
    const body = req.body

    if(!body.name ||!body.number) {
        return res.status(400).json({ error: "Missing name or person" })
    } 

    const existingPerson = persons.some(person => person.name === body.name)
    if (existingPerson) {
        return res.status(400).json({ error: "Name already exists" })
    }

    const person = {
        name : body.name,
        number : body.number,
        id: generateID() 
    }

    persons = persons.concat(person)
    res.json(person)
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 