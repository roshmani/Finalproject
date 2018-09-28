var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
const dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.regUsers = function(fname, lname, email, password) {
    var query = `INSERT INTO users(fname,lname,email,password)
	VALUES($1,$2,$3,$4) RETURNING id,fname,lname`;

    return db.query(query, [
        fname || null,
        lname || null,
        email || null,
        password || null
    ]);
};

module.exports.checkEmail = function(emailid) {
    var query = `SELECT * FROM users WHERE email=$1`;
    return db.query(query, [emailid]);
};

module.exports.getUserDetails = function(userid) {
    var query = `SELECT * FROM users WHERE id=$1`;
    return db.query(query, [userid]);
};

module.exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getRecentMessages = function(room_id) {
    const query = `SELECT users.id,fname, lname, chats.id as chatid,sender_id,to_char(send_at,'Day, DD-MM-YYYY HH12:MI:SS') as send_at,message
    FROM chats
    LEFT JOIN users
    ON (sender_id = users.id)
    WHERE room_id=$1
    ORDER BY chatid DESC
    LIMIT 3`;
    return db.query(query, [room_id || null]);
};

module.exports.saveChatMsg = function(senderid, message, room_id) {
    var query = `INSERT INTO chats(sender_id,message,room_id)
	VALUES($1,$2,$3) RETURNING id as chatid,sender_id,to_char(send_at,'Day, DD-MM-YYYY HH12:MI:SS') as send_at,message`;

    return db.query(query, [
        senderid || null,
        message || null,
        room_id || null
    ]);
};

module.exports.getCode = function(coder_id) {
    console.log("coder_id:", coder_id);
    const query = `SELECT *
    FROM codestore
    WHERE coder_id=$1`;
    return db.query(query, [coder_id || null]);
};

module.exports.saveCode = function(coder_id, code) {
    console.log("running save chat msg");
    var query = `INSERT INTO codestore(coder_id,codetext)
	VALUES($1,$2)
    ON CONFLICT (coder_id)
    DO UPDATE SET codetext = $2 RETURNING *`;

    return db.query(query, [coder_id || null, code || null]);
};
