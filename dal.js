const { MongoClient } = require("mongodb");
const url = 'mongodb+srv://Jenni:Mongo1988@fullbank.kyp8jiz.mongodb.net/?retryWrites=true&w=majority';
const dbName = "Fullbank";

let db = null;

// Connect to MongoDB
async function connectToDB() {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

// Wait for the connection to be established before using the database
function withDB(callback) {
  if (db) {
    callback(db);
  } else {
    setTimeout(() => withDB(callback), 100);
  }
};

// Create user accounts
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    withDB((db) => {
      const collection = db.collection("users");
      const doc = { name, email, password, balance: 0 };
      collection.insertOne(doc, { w: 1 }, function (err, result) {
        err ? reject(err) : resolve(doc);
      });
    });
  });
}

// Get user data by email
async function userdata(email) {
  return new Promise((resolve, reject) => {
    withDB((db) => {
      const customer = db.collection("users").findOne({ email: email });
      resolve(customer);
    });
  });
}

// Get all users
function all() {
  return new Promise((resolve, reject) => {
    withDB((db) => {
      const customers = db.collection("users").find({}).toArray();
      resolve(customers);
    });
  });
}

// Verify user by email
function login(email) {
  return new Promise((resolve, reject) => {
    withDB((db) => {
      const collection = db.collection("users");
      const doc = collection.findOne({ email: email });
      resolve(doc);
    });
  });
}

// Deposit amount for a user
function deposit(email, amount) {
  return new Promise((resolve, reject) => {
    withDB((db) => {
      const collection = db.collection("users");
      const user = collection.findOne({ email: email });
      const newBalance = Number(user.balance ?? 0) + Number(amount);
      collection
        .updateOne({ email: email }, { $set: { balance: newBalance } })
        .then((res) => {
          resolve(collection.findOne({ email: email }));
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

// Withdraw amount for a user
async function withdraw(email, amount) {
  const user = await withDB((db) => {
    return db.collection("users").findOne({ email: email });
  });

  if (Number(amount) < 0) {
    throw new Error("Error: amount must be a positive number");
  }
  if (!user) {
    throw new Error("Error: no user found");
  }

  let { balance } = user;

  if (Number(amount) > balance) {
    throw new Error("Error: amount cannot exceed the existing balance");
  }

  balance = Number(balance) - Number(amount);

  await withDB((db) => {
    db.collection("users").updateOne({ email: email }, { $set: { balance } });
  });

  return { ...user, balance };
};
module.exports = { create, all, login, deposit, withdraw, userdata };
