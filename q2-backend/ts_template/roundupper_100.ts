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

// === HELPER FUNCTIONS ===
// Helper function that returns the spaceEntity with a name attribute in its metadata
// equivalent to the given cowboyName.
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

// Helper function that determines if the type of the given input is spaceAnimal or spaceCowboy
function isSpaceAnimal(animal: spaceAnimal | spaceCowboy): animal is spaceAnimal {
    return (animal as spaceAnimal).type !== undefined;
}

// Helper function that returns all animals lassoable to the given cowboy.
function getLassoableAnimals(cowboy: spaceEntity, lassoLength: number): lassoableAnimal[]{
    let lassoableAnimals = [] as lassoableAnimal[]
    for (const entity of spaceDatabase) {
        if (isSpaceAnimal(entity.metadata) 
            && isLassoable(entity.location, cowboy.location, lassoLength)) {
            lassoableAnimals.push({
                type: (entity.metadata as spaceAnimal).type, 
                location: entity.location
            })
        }
    }
    return lassoableAnimals;
}

// Helper function that determines if the Pythagorean distance between the cowboy and animal
// is less than or equal to the given lasso length.
function isLassoable(animal: location, cowboy: location, lassoLen: number) {
    return Math.sqrt(Math.pow(animal.x - cowboy.x, 2) + Math.pow(animal.y - cowboy.y, 2)) <= lassoLen;
}

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json()); // built-in middleware for json

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    if (req.body.entities === undefined) {
        res.send(400)
    }
    const entities = req.body.entities as spaceEntity[];
    entities.forEach((entity: spaceEntity) => { spaceDatabase.push(entity) })
    res.status(200).send({});
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    if (req.query.cowboy_name === undefined) {
        res.send(400)
    }
    const cowboyEntity = getCowboyEntity(req.query.cowboy_name as string);
    if (cowboyEntity.location.x === Number.POSITIVE_INFINITY) {
        res.send(400)
    }

    const lassoLength = (cowboyEntity.metadata as spaceCowboy).lassoLength;
    let lassoableAnimals = getLassoableAnimals(cowboyEntity, lassoLength)

    res.status(200).send({space_animals: lassoableAnimals});
})



app.listen(8080);
