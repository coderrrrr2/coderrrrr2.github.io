const { MongoClient, ObjectId } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'music_player_db';

class MongoDB {
  constructor() {
    this.client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  }

  async connect() {
    await this.client.connect();
    console.log('Connected to MongoDB');
    this.db = this.client.db(dbName);
    this.musicCollection = this.db.collection('music');
    this.playlistsCollection = this.db.collection('playlists');
  }

  async disconnect() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  async getAllMusic() {
    return await this.musicCollection.find().toArray();
  }

  async getMusicById(id) {
    return await this.musicCollection.findOne({ _id: ObjectId(id) });
  }

  async getAllPlaylists() {
    return await this.playlistsCollection.find().toArray();
  }

  async getPlaylistById(id) {
    return await this.playlistsCollection.findOne({ _id: ObjectId(id) });
  }
}

module.exports = MongoDB;
