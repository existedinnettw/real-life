if (!global.db) {
    const pgp = require('pg-promise')()
    db = pgp(process.env.DB_URL)
}


// this only tranfer sql to same js action
function list(serchText = '', usersID) {
    let where = []
    if (serchText) {
        where.push(`text ILIKE '%$1:value%'`)
    }
    where.push('users_id = $2')
    let sql = `
    SELECT * FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY id DESC
    `
    return db.any(sql, [serchText, usersID])
}

function create(summary, init_time, due_time, target, purpose, expect_time, users_id) {
    const sql = `
    INSERT INTO events ($<this:name>)
    VALUES ($<summary>, $<init_time>, $<due_time>, $<target>, $<purpose>, $<expect_time>, $<users_id>)
    RETURNING *
    `
    return db.one(sql, { summary, init_time, due_time, target, purpose, expect_time, users_id })
}
function update(id, users_id, payload) {
    //payload is object contain new event info (without id)
    let newValues=[]
    keys=Object.keys(payload)
    let i
    for(i=0; i<keys.length; i++){
        newValues.push(`${keys[i]} = $${i+1}`)
    }
    values=Object.values(payload)
    let conditions = [`id = $${i+1}`, `users_id = $${i+2}`]
    const sql = `
    UPDATE events 
    SET ${newValues.join(', ')}
    WHERE ${conditions.join(' AND ')}
    RETURNING *
    `
    values.push(id)
    values.push(users_id)
    //console.log(sql,keys,values)
    return db.one(sql, values)
}
function deleteSQL(id, users_id) {
    let conditions = [`id = $<id>`, `users_id = $<users_id>`]
    const sql = `
    DELETE FROM events
    WHERE ${conditions.join(' AND ')}
    RETURNING *
    `
    return db.many(sql, { id, users_id })
}

module.exports = {
    list, update, create, deleteSQL
}


