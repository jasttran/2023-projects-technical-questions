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
    // TODO if all properties exist
    if (req.body.entities === undefined) {
        res.send(400)
    }
    const entities = req.body.entities as spaceEntity[];
    entities.forEach((entity: spaceEntity) => { spaceDatabase.push(entity) })
    res.status(200).send({});
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    // [X] not given cowboy name 
    // [X] cowboy does not exist
    // [ ] no animals in range 

    // assumes all properties exist due to checking in /entity endpoint
    if (req.query.cowboy_name === undefined) {
        res.send(400)
    }
    const cowboyEntity = getCowboyEntity(req.query.cowboy_name as string);
    console.log("cowboy entity")
    console.log(cowboyEntity)
    if (cowboyEntity.location.x === Number.POSITIVE_INFINITY) {
        res.send(400)
    }

    const lassoLength = (cowboyEntity.metadata as spaceCowboy).lassoLength;

    let lassoableAnimals = [] as lassoableAnimal[]
    for (const entity of spaceDatabase) {
        if (isSpaceAnimal(entity.metadata) 
            && isLassoable(entity.location, cowboyEntity.location, lassoLength)) {
            lassoableAnimals.push({
                type: (entity.metadata as spaceAnimal).type, 
                location: entity.location
            })
        }
    }

    res.status(200).send({space_animals: lassoableAnimals});
})

function isLassoable(animal: location, cowboy: location, lassoLen: number) {
    return Math.sqrt(Math.pow(animal.x - cowboy.x, 2) + Math.pow(animal.y - cowboy.y, 2)) <= lassoLen;
}
function getCowboyEntity(cowboyName: string): spaceEntity {
    for (const entity of spaceDatabase) {
        if ((entity.metadata as spaceCowboy).name === cowboyName) {
            return entity
        }
    }
    return { 
        type: "space_cowboy", 
        metadata: { 
            name: '', 
            lassoLength: -1 }, 
        location: { 
            x: Number.POSITIVE_INFINITY, 
            y: Number.POSITIVE_INFINITY
        }
    };
}

function isSpaceAnimal(animal: spaceAnimal | spaceCowboy): animal is spaceAnimal {
    return (animal as spaceAnimal).type !== undefined;
}

app.listen(8080);
