const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const { hashPass, checkPass } = require("./PwdEncryption");
const {
    regUsers,
    checkEmail,
    getUserDetails,
    getUsersByIds,
    getRecentMessages,
    saveChatMsg
} = require("./codetogetherdb");
app.use(compression());
const { secret } = require("./secrets.json");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
app.use(require("cookie-parser")());
/*config:body parser*/
app.use(require("body-parser").json());
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
    response.redirect("/welcome");
});

app.get("/Welcome", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
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
    let idval, fname, lname;
    if (req.body.emailid && req.body.password) {
        checkEmail(req.body.emailid)
            .then(function(results) {
                if (results.rows.length > 0) {
                    idval = results.rows[0].id;
                    fname = results.rows[0].fname;
                    lname = results.rows[0].lname;
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
                    req.session.user = fname + " " + lname;
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
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};

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
        console.log("users online", onlineUsers);
        console.log("in joining room in SERVER");
        socket.join(data.room, () => {
            let rooms = Object.keys(socket.rooms);
            console.log("room:", rooms); // [ <socket.id>, 'room 237' ]
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
        socket.on("codeUpdate", payload => {
            console.log("room for code", data.room);

            io.to(data.room).emit("updateCode", {
                code: payload.code
            });
        });

        /************************************************************************/
        getRecentMessages()
            .then(({ rows }) => {
                io.to(data.room).emit("chatMessages", rows.reverse());
            })
            .catch(function(err) {
                console.log("Error occured in getting chat messages", err);
            });

        /************************************************************************/

        socket.on("chat", message => {
            saveChatMsg(userId, message)
                .then(({ rows }) => {
                    let userdet = Object.assign(rows[0]);
                    getUserDetails(userId)
                        .then(({ rows }) => {
                            console.log("userdet:", userdet);
                            io.to(data.room).emit(
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
    });

    socket.on("leaveRoom", data => {
        delete roomUsers[socket.id];
        //check if the users are in  object.values(userid ) then emit
        if (!Object.values(roomUsers).includes(userId)) {
            io.to(data.room).emit("userLeft", userId);
        }
    });

    socket.on("disconnect", () => {});
});
