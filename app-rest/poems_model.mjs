import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB Poems Data using Mongoose!");
});

/**
 * Define the poems schema
 */
const poemSchema = mongoose.Schema({
    name: { type: String, required: true },
    poem: { type: String, required: true }
});


/**
 * Compile the models from the schemas. This must be done after defining the schema.
 */
const Poem = mongoose.model("Poem", poemSchema);


const createPoem = async (name, poem) => {
    const new_poem = new Poem({name: name, poem: poem});
    return new_poem.save();
}

const findPoembyId = async (_id) => {
    const query = Poem.findById(_id);
    return query.exec()
}

const findPoems = async (filter) => {
    const query = Poem.find(filter);
    return query.exec()
}

const updatePoems = async(_id, update) => {
    const result = await Poem.replaceOne(_id, update);
    return result.modifiedCount;
};

const deletePoemById = async (_id) => {
    const result = await Poem.deleteOne({ _id: _id });
    return result.deletedCount;
};



export{ createPoem, findPoembyId, findPoems, updatePoems, deletePoemById };
