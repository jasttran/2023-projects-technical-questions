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

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    const { entities } = req.body;
    entities.forEach(entity => { spaceDatabase.push(entity) })
    res.status(200).send({});
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const { cowboy_name } = req.body;

    // find lassoLength of the cowboy
    let lassoLen = null;
    let cowboy: spaceEntity = null;
    for (const entity of spaceDatabase) {
        if (entity.type === "space_cowboy" && entity.metadata.name === cowboy_name) {
            cowboy = entity;
        }
    }
    if (cowboy === null) return res.status(400);

    // find all animals within range
    let lassoableAnimals = [] as lassoableAnimal[];
    for (const entity of spaceDatabase) {
        if (entity.type === "space_animal") {
            const location = entity.location;
            const distance = Math.sqrt(Math.pow(location.x - cowboy.location.x, 2) + Math.pow(location.y - cowboy.location.y, 2));
            if (distance <= lassoLen) {
                lassoableAnimals.push({
                    "type": entity.metadata.type,
                    "location": {
                        "x": entity.location.x,
                        "y": entity.location.y
                    } 
                })
            }
        }
    }

    res.status(200).send({ space_animals: lassoableAnimals });
})

app.listen(8080);
