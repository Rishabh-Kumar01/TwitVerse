class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const newData = this.model.create(data);
      return newData;
    } catch (error) {
      console.log(error, "Error in Crud Repository while creating");
      throw new Error(`Error in Crud Repository while creating: ${error}`);
    }
  }

  async getById(data) {
    try {
      const response = this.model.findOne(data);
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Repository while getting by id");
      throw new Error(`Error in Crud Repository while getting by id: ${error}`);
    }
  }

  async getAll() {
    try {
      const data = this.model.find();
      return data;
    } catch (error) {
      console.log(error, "Error in Crud Repository while getting all");
      throw new Error(`Error in Crud Repository while getting all: ${error}`);
    }
  }

  async update(id, data) {
    try {
      const updatedData = this.model.findByIdAndUpdate(id, data, { new: true });
      return updatedData;
    } catch (error) {
      console.log(error, "Error in Crud Repository while updating");
      throw new Error(`Error in Crud Repository while updating: ${error}`);
    }
  }

  async delete(id) {
    try {
      const deletedData = this.model.findByIdAndDelete(id);
      return deletedData;
    } catch (error) {
      console.log(error, "Error in Crud Repository while deleting");
      throw new Error(`Error in Crud Repository while deleting: ${error}`);
    }
  }
}

export default CrudRepository;
