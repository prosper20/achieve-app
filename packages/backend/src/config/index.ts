import * as dotenv from "dotenv";
dotenv.config();

const e: any = process.env;

const PORT: number = parseInt(e.PORT || "3000", 10);
const JWT_SECRET: string = e.JWT_SECRET || "UMbEJrHSNF$aZc50uRP9B1kz";
const JWT_EXPIRE: number = parseInt(e.JWT_EXPIRE || "86400", 10);
const JWT_REFRESH_SECRET: string =
  e.JWT_REFRESH_SECRET || "rWJ2WRT4F5!5NUzzwPwnsZXy";
const JWT_REFRESH_EXPIRE: number = parseInt(
  e.JWT_REFRESH_EXPIRE || "608400",
  10
);

export {
  PORT,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE,
};
