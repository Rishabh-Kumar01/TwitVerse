class CrudService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    try {
      console.log(data, "Data in Crud Service while creating");
      const response = await this.repository.create(data);
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Service while creating");
      throw new Error(`Error in Crud Service while creating: ${error}`);
    }
  }

  async getAll() {
    try {
      const response = await this.repository.getAll();
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Service while getting all");
      throw new Error(`Error in Crud Service while getting all: ${error}`);
    }
  }

  async getById(id) {
    try {
      const response = await this.repository.getById(id);
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Service while getting by id");
      throw new Error(`Error in Crud Service while getting by id: ${error}`);
    }
  }

  async update(id, data) {
    try {
      const response = await this.repository.update(id, data);
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Service while updating");
      throw new Error(`Error in Crud Service while updating: ${error}`);
    }
  }

  async delete(id) {
    try {
      const response = await this.repository.delete(id);
      return response;
    } catch (error) {
      console.log(error, "Error in Crud Service while deleting");
      throw new Error(`Error in Crud Service while deleting: ${error}`);
    }
  }
}

export default CrudService;
