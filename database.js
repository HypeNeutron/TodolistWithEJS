const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

<<<<<<< HEAD
const uri = `mongodb+srv://admin-hypeneutron:${process.env.API_PASS}@cluster0.hq7q7.mongodb.net/todoListDB?appName=mongosh+1.3.1`;
=======
const uri = `mongodb+srv://admin-hypeneutron:zA7P79UNnuNFSTP4@cluster0.hq7q7.mongodb.net/todoListDB?retryWrites=true&w=majority`;
>>>>>>> bb6e04004e25a4418a4d625d17e5bbe61af9ad48
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

const validator = {
   $and: [{ name: { $regex: /\w/i } }],
   $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
         name: {
            bsonType: "string",
            description: "name be a string and is required",
         },
      },
   },
};

async function conn(db) {
   try {
      client.connect();
      return client.db(db);
   } catch (e) {
      console.error(e);
   }
}

async function createCollection(dbn, colName) {
   const connectDB = await conn(dbn).catch(console.error);
   const collections = await connectDB
      .listCollections({ name: colName }, { nameOnly: true })
      .toArray();
   if (collections.length) {
      client.close();
      return;
   } else {
      await connectDB.createCollection(colName, {
         validator,
         validationAction: "error",
      });
      client.close();
   }
}

async function SLcollectName(dbn, colName) {
   try {
      await client.connect();
      const connectDB = client.db(dbn);
      return connectDB.collection(colName);
   } catch (e) {
      console.error(e);
   }
}

module.exports = { SLcollectName, createCollection };
