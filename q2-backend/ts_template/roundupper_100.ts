import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };

type lassoableAnimal = { type: "pig" | "cow" | "flying_burger", location: location }


// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json()); // built-in middleware for json

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    if (req.body.entities !== undefined) {
        const entities = req.body.entities as spaceEntity[];
        entities.forEach((entity: spaceEntity) => { spaceDatabase.push(entity) })
    }
    res.status(200).send({});
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const { cowboy_name } = req.body;

    //res.status(200).send({ space_animals: lassoableAnimals });
})

app.listen(8080);
