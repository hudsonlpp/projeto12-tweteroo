import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000);

class Server {
    constructor (user, username, avatar, tweet) {
    this.user = user;
    this.username = username;
    this.avatar = avatar;
    this.tweet = tweet;
    }
  }

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    if (typeof username !== "string" || typeof avatar !== 'string') {
        return res.status(400).send("Todos os campos são obrigatórios");
    } else if (typeof username !== "string" || typeof avatar !== "string") {
        return res.status(400).send("Todos os campos devem ser strings!");
    }
    users.push(new Server(username, avatar));
    res.status(201).send('OK');
})

app.post("/tweets", (req, res) => {
    const tweet = req.body.tweet;
	const username = req.headers.user;
    const user = users.find(user => user.username === username);
  
    if (!username || !tweet || typeof username !== "string" || typeof tweet !== "string") {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
  
    if (!user) {
      return res.sendStatus(401);
    }
    
    tweets.push(new Server(user, tweet));
    res.status(201).send('OK');
  });

app.get("/tweets", (req, res) => {

    tweets.forEach((tweet) => {
        const { avatar }  = users.find((user) => user.username === tweet.username)
        tweet.avatar = avatar
    })

    if(tweets.length <= 10) {
        return res.send([...tweets].reverse())
    } else {
        return res.send([...tweets].reverse().slice(0, 10))
    }
})