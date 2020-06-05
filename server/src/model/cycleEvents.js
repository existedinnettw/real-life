
if(!global.db){
    const pgp=require('pg-promise')()
    db= pgp(process.env.DB_URL)
}

//should modify 
function list(serchText='', usersID){
    const where=[]
    if(serchText){
        where.push(`text ILIKE '%$1:value%'`)
    }
    where.push('id = $2')
    const sql=`
    SELECT * FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY id DESC
    `
    return db.any(sql, [serchText,usersID])
}

function create(summary, init_time, due_time, target, expect_time, users_id){
    const sql=`
    INSERT INTO events ($<this:name>)
    VALUES ($<summary>, $<init_time>, $<due_time>, $<target>, $<expect_time>, $<users_id>)
    RETURNING *
    `
    return db.one(sql, {summary, init_time, due_time, target, expect_time, users_id} )
}

module.exports={
    list, create
}


