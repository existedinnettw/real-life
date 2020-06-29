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
    SELECT * FROM cycle_events
    WHERE ${where.join(' AND ')}
    ORDER BY id DESC
    `
    return db.any(sql, [serchText, usersID])
}

function create(summary, init_cron, due_cron, target, purpose, expect_time, users_id) {
    const sql = `
    INSERT INTO cycle_events ($<this:name>)
    VALUES ($<summary>, $<init_cron>, $<due_cron>, $<target>, $<purpose>, $<expect_time>, $<users_id>)
    RETURNING *
    `
    return db.one(sql, { summary, init_cron, due_cron, target, purpose, expect_time, users_id })
}

function update(id, users_id, payload) {
    //payload is object contain new cycle_event info (without id)
    let newValues = []
    keys = Object.keys(payload)
    let i
    for (i = 0; i < keys.length; i++) {
        newValues.push(`${keys[i]} = $${i + 1}`)
    }
    values = Object.values(payload)
    let conditions = [`id = $${i + 1}`, `users_id = $${i + 2}`]
    const sql = `
    UPDATE cycle_events 
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
    DELETE FROM cycle_events
    WHERE ${conditions.join(' AND ')}
    RETURNING *
    `
    return db.many(sql, { id, users_id })
}
function creatDefaultEvents(users_id) {
    const sql = `
    INSERT INTO cycle_events (summary, init_cron, due_cron, target, expect_time, users_id)
    VALUES 
    ('example cycle_events (◕ܫ◕)', '0 9 * * 2-4', '* 10 * * 2-4', 'full function and done', NULL, $<users_id>)
    RETURNING *
    `
    // INSERT INTO cycle_events (summary, init_cron, due_cron, target, expect_time, users_id)
    // VALUES 
    // ('example cycle_events ^_^', '0 7 * * *', '* 8 * * *', 'full function and done', NULL, $<users_id>),
    // ('example cycle_events 0_0', '0 8 * * 1', '* 9 * * 1', 'finish', 2, $<users_id>),
    // ('example cycle_events 0o0', '0 9 * * 2-4', '* 10 * * 2-4', 'full function and done', NULL, $<users_id>)
    // RETURNING *
    return db.many(sql, {users_id})
}

module.exports = {
    list, update, create, deleteSQL, creatDefaultEvents
}


