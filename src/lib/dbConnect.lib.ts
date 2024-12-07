import mongoose from "mongoose";

type connectionObjet = {
  isConnected?: Number;
};

const connection: connectionObjet = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log(" already connected  to db");
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to the database", db.connections);
  } catch (error) {
    console.log("error at db connection", error);
    process.exit(1);
  }
};

export default dbConnect;
