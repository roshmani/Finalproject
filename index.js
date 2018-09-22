const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const { hashPass, checkPass } = require("./PwdEncryption");
const { regUsers, checkEmail, getUserDetails } = require("./codetogetherdb");
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
            .then(function(userid) {
                req.session.userId = userid.rows[0].id;
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
    let idval, fname;
    if (req.body.emailid && req.body.password) {
        checkEmail(req.body.emailid)
            .then(function(results) {
                if (results.rows.length > 0) {
                    idval = results.rows[0].id;
                    fname = results.rows[0].fname;
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

    socket.on("disconnect", () => {
        console.log("user left!");
    });
});
