
//before excute the schema.js, you should create db by your own.
//createdb -U postgres <DB_NAME>

let port
if (process.env.NODE_ENV == 'production') {
    port = process.env.DEV_PORT
    process.env.DB_URL = `postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
} else {
    //development
    port = process.env.DEV_PORT
    //you should create DB first
    process.env.DB_URL = `postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOSTNAME}:${process.env.PG_PORT}/${process.env.PG_DB_NAME}`;
}

module.exports = { port }