if(!global.db){
    const pgp=require('pg-promise')()
    db= pgp(process.env.DB_URL)
}

// this only tranfer sql to same js action
function list(usersID){
    const sql=`
    SELECT * FROM events INNER JOIN today_events ON events.id=today_events.events_id
    WHERE today_events.users_id = $1
    `
    return db.any(sql, [usersID])
}

function create(users_id, events_id){
    const sql=`
    INSERT INTO today_events ($<this:name>)
    VALUES ($<users_id>, $<events_id>)
    RETURNING *
    `
    return db.one(sql, {users_id, events_id} )
}

module.exports={
    list, create
}

