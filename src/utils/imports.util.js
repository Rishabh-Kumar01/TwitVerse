import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responseCodes from "http-status-codes";
import passportJWT from "passport-jwt";
import passport from "passport";
import multer from "multer";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import redis from "redis";
import kafka from "kafkajs";

export {
  mongoose,
  morgan,
  helmet,
  cors,
  express,
  compression,
  expressValidator,
  dotenv,
  bodyParser,
  bcrypt,
  jwt,
  responseCodes,
  passportJWT,
  passport,
  multer,
  swaggerJsdoc,
  swaggerUi,
  redis,
  kafka,
};
