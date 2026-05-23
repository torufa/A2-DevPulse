import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path : path.join(process.cwd(), '.env')
})

const config = {
  port: process.env.PORT,
  connectionString: process.env.connectionString as string,
  PASSWORD_HASH_SALT : process.env.PASSWORD_HASH_SALT as string
};

export default config