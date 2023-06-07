import { knex } from "knex"
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

console.log(path.join(__dirname, '../../labeedit.db'))
export abstract class BaseDatabase {
    protected static connection = knex({
        client: "sqlite3",
        connection: {
            /*filename: process.env.DB_FILE_PATH as string
            /*filename: "./src/database/labeedit.db",
            filename: "/labeedit.db"*/
            filename: path.join(__dirname, '../../labeedit.db')
        },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run("PRAGMA foreign_keys = ON", cb)
            }
        }
    })
}
