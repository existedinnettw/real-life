

if(!global.db){
    const pgp=require('pg-promise')()
    db= pgp(process.env.DB_URL)
}

function list( email ){
    //get user id from user email
    const sql=`
    SELECT * FROM users
    WHERE email = $1
    `
    return db.oneOrNone(sql, [email])
}

function create(email){
    const sql=`
    INSERT INTO users (email)
    VALUES ($<email>)
    RETURNING *
    `
    // console.log('sql:',sql)
    return db.one(sql, {email} )
}

module.exports={
    list, create
}

