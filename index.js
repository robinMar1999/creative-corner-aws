const express = require('express')
const AWS = require('aws-sdk');
const path = require('path');
const config = require('config')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || config.get("credentials.accessKeyId"),
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY || config.get("credentials.secretAccessKey")
})

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
app.set("views", path.join(__dirname, "views"))

const s3 = new AWS.S3({
    region: 'ap-south-1'
});

app.get("/", async (req,res)=>{
    try {
        const response = await s3.listObjects({
            Bucket: 'projects-puneet-panwar-2408'
        }).promise();
        const itemKeys = [];
        response.Contents.forEach(item => {
            itemKeys.push(item.Key);
        })
        res.render("index",{
            itemKeys
        })
    } catch (err) {
        console.log(err);
    }
})

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})