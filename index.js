const express = require('express')
const AWS = require('aws-sdk')

AWS.config.loadFromPath('./config/aws.json');

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))

app.get("/", (req,res)=>{
    res.render("index")
})

const s3 = new AWS.S3({
    region: 'ap-south-1'
});

const run = async () => {
    try {
        const response = await s3.listObjects({
            Bucket: 'projects-puneet-panwar-2408'
        }).promise();
        response.Contents.forEach(item => {
            console.log(item);
        })
    } catch (error) {
        console.log(error);
    }
}

run();



const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})