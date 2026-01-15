// class/entity.js
import mongoose from "mongoose";

class DB {
  constructor({ name }) {
    if (!name) throw new Error("Entity name is required");

    this.name = name;
    this.db = null;
    this.models = Object.create(null);
    this.connected = false;
  }

  /**
   * Connect this entity to MongoDB
   */
  async connect(uri) {
    if (this.connected) return this.db;
    if (!uri) throw new Error("MongoDB URI is required");

    this.db = mongoose.createConnection(uri, {
      dbName: this.name,
    });

    await this.db.asPromise();

    this.connected = true;
    console.info(`✔ DB "${this.name}" connected`);

    return this.db;
  }

  /**
   * Register a model on this entity
   */
  addModel(modelName, schema) {
    if (!this.connected) {
      throw new Error(`DB "${this.name}" is not connected`);
    }

    if (this.db.models[modelName]) {
      this.models[modelName] = this.db.models[modelName];
      return this.models[modelName];
    }

    const model = this.db.model(modelName, schema);
    this.models[modelName] = model;

    return model;
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.connected = false;
    }
  }

  toJSON() {
    return {
      name: this.name,
      connected: this.connected,
      models: Object.keys(this.models),
    };
  }
}

export default DB;
