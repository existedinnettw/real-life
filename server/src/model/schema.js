
require('../../config')
const pgp = require('pg-promise')()
const db = pgp(process.env.DB_URL)

const schemaSql = `
--- Extension
--- extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

--- Drop (if table already exist)
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS cycle_events;
DROP TABLE IF EXISTS users;

--- Reference
--- https://www.postgresqltutorial.com/postgresql-char-varchar-text/
--- https://www.postgresqltutorial.com/postgresql-foreign-key/

--- Create users
CREATE TABLE users(
    id          SERIAL PRIMARY KEY NOT NULL,
    email       text NOT NULL
);

--- USING gin(text gin_trgm_ops);

--- Create cycleEvents
CREATE TABLE cycle_events(
    id          SERIAL PRIMARY KEY NOT NULL,
    summary     text NOT NULL,
    init_corn   text NOT NULL,
    due_corn    text NOT NULL,
    target      text,
    expect_time float,
    users_id     INTEGER REFERENCES users(id)
);

--- Create events
CREATE TABLE events(
    id              SERIAL PRIMARY KEY NOT NULL,
    summary         text NOT NULL,
    init_time       bigint NOT NULL,
    due_time        bigint NOT NULL,
    done_ts         bigint,
    target          text,
    expect_time     float,
    time_spent      float,
    users_id         INTEGER REFERENCES users(id),
    cycle_events_id INTEGER REFERENCES cycle_events(id)
);

`
const dataSql=`
--- Populate dummy data to user
INSERT INTO users (email)
VALUES ('existedinnettw@gmail.com');

--- Populate dummy data to cycleEvents
INSERT INTO cycle_events (summary, init_corn, due_corn, target, expect_time, users_id)
VALUES ('brush tooth and bash, eating breakfast', '* 7 * * *', '* 8 * * *', 'done and clean', 0.83, 1);

--- Populate dummy data to events
INSERT INTO events (summary, init_time, due_time, target, expect_time, users_id)
VALUES ('write os project', round(extract(epoch from now())), 1593475200, 'full function and done', NULL, 1);
`

db.none(schemaSql).then(()=>{
    console.log("Schema created, then creating fake data...")
    db.none(dataSql).then(()=>{
        console.log("fake data created, you can start using api now")
        pgp.end()
    })
}).catch((err)=>{
    console.log('ERROR in creating schema: ',err)
})

