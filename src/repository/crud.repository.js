import { DatabaseError } from "../error/custom.error.js";

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const newData = await this.model.create(data);
      return newData;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getById(data) {
    try {
      const response = await this.model.findOne(data).read("secondary");
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Repository while getting by id");
      throw new DatabaseError(error);
    }
  }

  async getAll() {
    try {
      const data = await this.model.find().read("secondary");
      return data;
    } catch (error) {
      console.log(error, "Error in Crud Repository while getting all");
      throw new DatabaseError(error);
    }
  }

  async update(id, data) {
    try {
      const updatedData = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedData;
    } catch (error) {
      console.log(error, "Error in Crud Repository while updating");
      throw new DatabaseError(error);
    }
  }

  async delete(id) {
    try {
      const deletedData = await this.model.findByIdAndDelete(id);
      return deletedData;
    } catch (error) {
      console.log(error, "Error in Crud Repository while deleting");
      throw new DatabaseError(error);
    }
  }
}

export default CrudRepository;
