import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";
const { StatusCodes } = responseCodes;

class CrudService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    try {
      const response = await this.repository.create(data);
      return response;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to create",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new ServiceError(
        "Creation failed",
        "An error occurred while creating the resource",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAll() {
    try {
      const response = await this.repository.getAll();
      return response;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to retrieve",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new ServiceError(
        "Retrieval failed",
        "An error occurred while retrieving the resources",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id, page, size) {
    try {
      const response = await this.repository.getById({ _id: id }, page, size);
      if (!response) {
        throw new ServiceError(
          "Not found",
          "The requested resource does not exist",
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to retrieve",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Retrieval failed",
        "An error occurred while retrieving the resource",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id, data) {
    try {
      const response = await this.repository.update(id, data);
      if (!response) {
        throw new ServiceError(
          "Not found",
          "The resource to update does not exist",
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to update",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Update failed",
        "An error occurred while updating the resource",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id) {
    try {
      const response = await this.repository.delete(id);
      if (!response) {
        throw new ServiceError(
          "Not found",
          "The resource to delete does not exist",
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to delete",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Deletion failed",
        "An error occurred while deleting the resource",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default CrudService;
