import { SeedService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const seedService = SeedService.getInstance();

const seedData = async (req, res, next) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 10;
    const result = await seedService.seedData(count);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Data seeded successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export { seedData };
