const MongoClient = require("mongodb").MongoClient;
const url = 'mongodb+srv://Jenni:Mongo1988@fullbank.kyp8jiz.mongodb.net/?retryWrites=true&w=majority';
let db = null;

//connect to mongodb
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db("Fullbank");
    console.log("Successfully connected to MongoDB!");
  })
  .catch(console.error);

//create user accounts
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

async function userdata(email) {
  const customer = await db.collection("users").findOne({ email: email });
  return customer;
}

//all users
function all() {
  return new Promise(async (resolve, reject) => {
    const customers = await db.collection("users").find({}).toArray();

    //return customers if any are found else if nothing is found then return an error
    return customers ? resolve(customers) : reject(customers);
  });
}

//verify user
function login(email) {
  return new Promise((resolve, reject) => {
    const collection = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

function deposit(email, amount) {
  return new Promise((resolve, reject) => {
    const user = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => {
        db.collection("users")
          .updateOne({ email: email }, { $set: { balance: Number(doc?.balance ?? 0) + Number(amount) } })
          .then((res) => {
            resolve(db.collection("users").findOne({ email: email }));
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function withdraw(email, amount) {
  //get the user
  const user = await db.collection("users").findOne({ email: email });

  if (Number(amount) < 0) {
    throw Error("Error: amount must be a positive number");
  }
  if (!user) {
    throw Error("Error: no user found");
  }

  let { balance } = user;

  if (Number(amount) > balance) {
    throw Error("Error: amount cannot exceed the existing balance");
  }

  //calculate the new balance
  balance = Number(balance) - Number(amount);

  //update the balance
  await db.collection("users").updateOne({ email: email }, { $set: { balance } });

  //return the user with the new balance
  return { ...user, balance };
}

module.exports = { create, all, login, deposit, withdraw, userdata };
