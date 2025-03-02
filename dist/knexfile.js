import dotenv from "dotenv";
import "ts-node/register";
dotenv.config();
const config = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: "./migrations",
        },
        seeds: {
            directory: "./seeds",
        },
    },
};
export default config;
//# sourceMappingURL=knexfile.js.map