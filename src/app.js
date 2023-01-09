import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

class User {
    constructor (username, avatar) {
      this.username = username;
      this.avatar = avatar;
    }
  }
  
  class Tweet {
    constructor (user, tweet) {
      this.user = user;
      this.tweet = tweet;
    }
  }

const users = [];
const tweets = [];


function tweetSearcher(tweets, pageNumber = 1) {
	const sliceMin = (pageNumber - 1) * 10;
	const sliceMax = pageNumber * 10;
	const newTweetsArr = [...tweets].reverse();
	const tweetsearch = newTweetsArr
		.slice(sliceMin, sliceMax)
		.map((tweet) => {
			const user = users.find((user) => user.username === tweet.username);
			return { ...tweet, avatar: user.avatar };
		});
	return tweetsearch;
}

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    if (typeof username !== "string" || typeof avatar !== 'string') {
        return res.status(400).send("Todos os campos são obrigatórios");
    } else if (typeof username !== "string" || typeof avatar !== "string") {
        return res.status(400).send("Todos os campos devem ser strings!");
    }
    users.push(new User(username, avatar));
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
    
    tweets.push(new Tweet(user, tweet));
    res.status(201).send('OK');
  });

app.get("/tweets", (req, res) => {
    const page = req.query.page;
	if (page < 1) {
		res.status(400).send("Informe uma página válida!");
	}
    const tweetsearch = tweetSearcher(tweets, page);
	res.send(tweetsearch);
})

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params.username;
	const userTweets = tweets.filter((tweet) => tweet.username === username);
	const tweetsearch = tweetSearcher(userTweets);
	res.send(tweetsearch);
})

app.listen(5000);