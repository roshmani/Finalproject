const nodeMailer = require("nodemailer");
const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 codecube.herokuapp.com:*"
});
const { hashPass, checkPass } = require("./PwdEncryption");
const {
    regUsers,
    checkEmail,
    getUserDetails,
    getUsersByIds,
    getRecentMessages,
    saveChatMsg,
    saveCode,
    getCode
} = require("./codetogetherdb");
app.use(compression());
const csurf = require("csurf");
const cookieSession = require("cookie-session");
app.use(require("cookie-parser")());
/*config:body parser*/
app.use(require("body-parser").json());

let secret, authmail, authpsw;
if (process.env.secret) {
    secret = process.env.secret;
} else {
    const secrets = require("./secrets.json");
    secret = secrets.secret;
}

if (process.env.authmail) {
    authmail = process.env.authmail;
} else {
    const secrets = require("./secrets.json");
    authmail = secrets.authmail;
}

if (process.env.authpsw) {
    authpsw = process.env.authpsw;
} else {
    const secrets = require("./secrets.json");
    authpsw = secrets.authpsw;
}

const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
/**********************************************************************************************************/
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.static("./public"));

app.get("/logout", function(request, response) {
    request.session = null;
    response.redirect("/");
});

app.get("/", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/codecube");
    }
    res.sendFile(__dirname + "/index.html");
});
/*******************************************************************************************/
/*                                   get user details                                     */
/******************************************************************************************/
app.get("/getUserDetails", (req, res) => {
    const userId = req.session.userId;
    return getUserDetails(userId)
        .then(results => {
            res.json({
                id: userId,
                fname: results.rows[0].fname,
                lname: results.rows[0].lname
            });
        })
        .catch(function(err) {
            console.log("Error occured in getting user details:", err);
            res.json({ success: false });
        });
});
/*******************************************************************************************************/
app.post("/register", (req, res) => {
    if (
        req.body.fname &&
        req.body.lname &&
        req.body.emailid &&
        req.body.password
    ) {
        hashPass(req.body.password)
            .then(function(hashedpwd) {
                return regUsers(
                    req.body.fname,
                    req.body.lname,
                    req.body.emailid,
                    hashedpwd
                );
            })
            .then(function(results) {
                req.session.userId = results.rows[0].id;
                req.session.emailId = results.rows[0].email;
                req.session.user =
                    results.rows[0].fname + "" + results.rows[0].lname;
                res.json({ success: true });
            })
            .catch(function(err) {
                console.log("Error occured in register:", err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});
/******************************Login*******************************************************/
app.post("/login", (req, res) => {
    let idval, fname, lname, user, emailId;
    if (req.body.emailid && req.body.password) {
        checkEmail(req.body.emailid)
            .then(function(results) {
                if (results.rows.length > 0) {
                    idval = results.rows[0].id;
                    fname = results.rows[0].fname;
                    lname = results.rows[0].lname;
                    user = fname + " " + lname;
                    emailId = req.body.emailid;
                    return checkPass(
                        req.body.password,
                        results.rows[0].password
                    );
                } else {
                    throw new Error();
                }
            })
            .then(function(match) {
                if (match) {
                    req.session.userId = idval;
                    req.session.emailid = emailId;
                    req.session.fname = fname;
                    req.session.user = user;
                    res.json({ success: true, username: fname });
                } else {
                    throw new Error();
                }
            })
            .catch(function(err) {
                console.log("Error occured in login:", err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

/***********************************************************************************************************/

app.get("/savecode", (req, res) => {
    if (req.query.filename) {
        res.set(
            "Content-disposition",
            "attachment; filename=" + req.query.filename
        );
    }
    if (req.query.code) {
        res.setHeader("content-type", "plain/text");
        res.send(req.query.code);
    } else {
        res.json({ success: false });
    }
});

/***********************************************************************************************************/
app.post("/sendMail", function(req, res) {
    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: authmail,
            pass: authpsw
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take messages");
        }
    });

    let mailOptions = {
        from: req.session.user + "<" + req.session.emailid + ">", // sender address
        to: req.body.emailid, // list of receivers
        subject: "Invitation to Code Cube-Code together with me", // Subject line
        text: "Please click on the link after Logging in:" + req.body.sharedUrl,
        html:
            "<b>Please click on the link after Logging in Code Cube:</b>" +
            req.body.sharedUrl // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({ error: true });
        } else {
            //console.log("Message %s sent: %s", info.messageId, info.response);
            res.json({ success: true });
        }
    });
});
/***********************************************************************************************************/
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};
let timeSaved;
io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const socketId = socket.id;
    const userId = socket.request.session.userId;
    onlineUsers[socketId] = userId;

    let arrayOfuserIds = Object.values(onlineUsers);
    let roomUsers = [];
    /*************************************Join a Room***************************************************/

    socket.on("room", data => {
        console.log("in joining room in SERVER");
        socket.join(data.room, () => {
            let roomClients = io.sockets.adapter.rooms[data.room].sockets;
            let userRoom = Object.keys(roomClients);
            roomUsers = Object.keys(onlineUsers)
                .filter(key => userRoom.includes(key))
                .reduce((obj, key) => {
                    obj[key] = onlineUsers[key];
                    return obj;
                }, {});
        });
        /****************************************************************************************************/
        let arrayRoomUserIds = Object.values(roomUsers);

        getUsersByIds(arrayRoomUserIds)
            .then(({ rows }) => {
                io.to(data.room).emit("loadUsers", rows);
            })
            .catch(function(err) {
                console.log("Error occured in getting room users by ids:", err);
            });
        /************************************************************user joined*******************************/
        if (Object.values(roomUsers).filter(id => id == userId).length == 1) {
            /* or use ---if(arrayOfuserIds.indexOf(userId)==arrayOfuserIds.length - 1){*/
            getUserDetails(userId)
                .then(({ rows }) => {
                    io.to(data.room).emit("userJoined", rows[0]);
                })
                .catch(function(err) {
                    console.log(
                        "Error occured in getting last joined user in room details",
                        err
                    );
                });
        }
        /**********************update Code**************************************/
        getCode(data.room)
            .then(({ rows }) => {
                io.to(data.room).emit("updateCode", { code: rows[0].codetext });
            })
            .catch(function(err) {
                console.log(
                    "Error occured in getting Code in room details",
                    err
                );
            });

        socket.on("codeUpdate", payload => {
            io.to(data.room).emit("updateCode", {
                code: payload.code
            });
            if (Date.now() - timeSaved < 5000) {
                return;
            }
            timeSaved = Date.now();
            saveCode(data.room, payload.code)
                .then(({ rows }) => {
                    console.log("Code Saved sucessfully in db", rows);
                })
                .catch(function(err) {
                    console.log(
                        "Error occured in getting user details for chat",
                        err
                    );
                });
        });

        /************************************************************************/
        getRecentMessages(data.room)
            .then(({ rows }) => {
                io.to(data.room).emit("chatMessages", rows.reverse());
            })
            .catch(function(err) {
                console.log("Error occured in getting chat messages", err);
            });

        /************************************************************************/
    });
    socket.on("chat", message => {
        console.log("about to run save chat message");
        saveChatMsg(userId, message.message, message.room)
            .then(({ rows }) => {
                let userdet = Object.assign(rows[0]);
                getUserDetails(userId)
                    .then(({ rows }) => {
                        console.log("userdet:", userdet);
                        io.to(message.room).emit(
                            "chatMessage",
                            Object.assign({}, userdet, rows[0])
                        );
                    })
                    .catch(function(err) {
                        console.log(
                            "Error occured in getting user details for chat",
                            err
                        );
                    });
            })
            .catch(function(err) {
                console.log("Error occured in getting chat message", err);
            });
    });

    socket.on("leaveRoom", data => {
        delete roomUsers[socket.id];
        //check if the users are in  object.values(userid ) then emit
        console.log("user id:", userId);
        if (!Object.values(roomUsers).includes(userId)) {
            io.to(data.room).emit("userLeft", userId);
        }
    });

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        //check if the users are in  object.values(userid ) then emit
        if (!Object.values(onlineUsers).includes(userId)) {
            socket.broadcast.emit("userLeft", userId);
        }
    });
});
