
//before excute the schema.js, you should create db by your own.
//createdb -U postgres <DB_NAME>

let port
if(process.env.NODE_ENV=='production'){

}else{
    //development
    port=4000
    process.env.DB_URL=`postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOSTNAME}:${process.env.PG_PORT}/${process.env.PG_DB_NAME}`;
}

module.exports= {port}