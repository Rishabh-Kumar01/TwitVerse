import { SeedService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const seedService = SeedService.getInstance();

/**
 * @swagger
 * /v1/seed:
 *   get:
 *     summary: Seed the database with sample data
 *     tags: [Seed]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: The number of users to create (other entities will be created based on this count)
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                     hashtags:
 *                       type: integer
 *                     tweets:
 *                       type: integer
 *                     comments:
 *                       type: integer
 *                     likes:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
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
