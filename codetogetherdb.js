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

module.exports.getRecentMessages = function() {
    const query = `SELECT users.id,fname, lname, chats.id as chatid,sender_id,to_char(send_at,'Day, DD-MM-YYYY HH12:MI:SS') as send_at,message
    FROM chats
    LEFT JOIN users
    ON (sender_id = users.id)
    ORDER BY chatid DESC
    LIMIT 5`;
    return db.query(query);
};

module.exports.saveChatMsg = function(senderid, message) {
    var query = `INSERT INTO chats(sender_id,message)
	VALUES($1,$2) RETURNING id as chatid,sender_id,to_char(send_at,'Day, DD-MM-YYYY HH12:MI:SS') as send_at,message`;

    return db.query(query, [senderid || null, message || null]);
};
