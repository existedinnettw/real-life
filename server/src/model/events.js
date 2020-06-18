if(!global.db){
    const pgp=require('pg-promise')()
    db= pgp(process.env.DB_URL)
}


// this only tranfer sql to same js action
function list(serchText='', usersID){
    const where=[]
    if(serchText){
        where.push(`text ILIKE '%$1:value%'`)
    }
    where.push('users_id = $2')
    const sql=`
    SELECT * FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY id DESC
    `
    return db.any(sql, [serchText,usersID])
}

function create(summary, init_time, due_time, target, purpose, expect_time, users_id){
    const sql=`
    INSERT INTO events ($<this:name>)
    VALUES ($<summary>, $<init_time>, $<due_time>, $<target>, $<purpose>, $<expect_time>, $<users_id>)
    RETURNING *
    `
    return db.one(sql, {summary, init_time, due_time, target, purpose, expect_time, users_id} )
}
function delet(id){
    const sql=``
    return db.none()
}

module.exports={
    list, create
}


