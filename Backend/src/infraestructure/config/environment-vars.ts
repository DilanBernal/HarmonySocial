import * as joi from "joi";
import "dotenv/config";
require("dotenv").config();

export type ReturnEnvironmentVars = {
  PORT: number;
  ENVIRONMENT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SCHEMA: string;
  DB_SYNC: boolean;
  PASSWORD_SALT: number;
  JWT_SECRET: string;
};

type ValidationEnvironmentVars = {
  error: joi.ValidationError | undefined;
  value: ReturnEnvironmentVars;
};

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars {
  const envSchem = joi
    .object({
      PORT: joi.number().default(4666).required(),
      ENVIRONMENT: joi.string().default('dev').required(),
      DB_HOST: joi.string().required(),
      DB_PORT: joi.number().required(),
      DB_USER: joi.string().required(),
      DB_PASSWORD: joi.string().allow("").optional(),
      DB_NAME: joi.string().required(),
      DB_SCHEMA: joi.string().required(),
      DB_SYNC: joi.boolean().default(false).required(),
      PASSWORD_SALT: joi.number().default(4).required(),
      JWT_SECRET: joi.string().min(32).required(),
    })
    .unknown(true);
  const { error, value } = envSchem.validate(vars);
  return { error, value };
}

const loadEnvVars = (): ReturnEnvironmentVars => {
  const result = validateEnvVars(process.env);
  if (result.error) {
    throw new Error(`Error validating environment variables: ${result.error.message}`);
  }
  const value = result.value;
  return {
    PORT: value.PORT,
    ENVIRONMENT: value.ENVIRONMENT,
    DB_HOST: value.DB_HOST,
    DB_PORT: value.DB_PORT,
    DB_USER: value.DB_USER,
    DB_NAME: value.DB_NAME,
    DB_SCHEMA: value.DB_SCHEMA,
    DB_PASSWORD: value.DB_PASSWORD,
    DB_SYNC: value.DB_SYNC,
    PASSWORD_SALT: value.PASSWORD_SALT,
    JWT_SECRET: value.JWT_SECRET,
  };
};
const envs = loadEnvVars();

Object.freeze(envs);
export default envs;
