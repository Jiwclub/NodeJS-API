const express = require("express");
const bodyParser	= require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.get("/api/all", (req, res) => {
  res.setHeader("Content-Type", "application/json");
// get ข้อมูลที่อยู่ใน ไฟล์ feed.json
  fs.readFile(path.join(__dirname, "feed.json"), "utf8", (err, json) => {
    res.send(json);
  });
});
app.post("/api/add", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    
	let postData = req.body;

    //เพิ่มข้อมูล json ใส่ file feed.json
	fs.readFile(path.join(__dirname, "feed.json"), "utf8", (err, json) => {
        //แปลง string ให้เป็น object
		let posts = JSON.parse(json);
		//เพิ่มข้อมูลคำสั่งนี้
		posts.push(postData);
        //เพิ่มลงในไฟล์ feed.json                           JSON.stringify แปลง object ให้เป็น string
		fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), (e) => {
			if (e) throw e;

			console.log("Wrote File");
			res.send({msg: "Wrote File"});
		})
	});
});

app.post("/api/update", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	let newPost = req.body;

	fs.readFile(path.join(__dirname, "feed.json"), "utf8", (err, json) => {
		let posts = JSON.parse(json);
		
		posts.forEach(post => {
            //เช็ค post.id == newPost.id
			if (post.id == newPost.id) {
				post.id = newPost.id;
				post.title = newPost.title;
				post.body = newPost.body;
			} else {
				console.log("ID doesn't match");
			}
		});

		fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), (e) => {
			if (e) throw e;

			console.log("Updated Post");
			res.send({msg: "Updated Post"});
		})
	});
});

app.post("/api/remove", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	let postId = req.body.id;

	fs.readFile(path.join(__dirname, "feed.json"), "utf8", (err, json) => {
		let posts = JSON.parse(json);
		
		posts.forEach((post, i) => {
            // ถ้า id ที่อยู่ใน feed.json เทากับ id ที่ส่งไปใหม่ ให้ลบ
			if (post.id == postId) {
				posts.splice(i, 1);
			} else {
				console.log("ID doesn't match");
			}
		});

		fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), (e) => {
			if (e) throw e;

			console.log("Removed Post");
			res.send({msg: "Removed Post"});
		});
	});
});


// run server
app.listen(3000, e => {
  if (e) throw e;

  console.log("Server has started on port 3000...");
});
