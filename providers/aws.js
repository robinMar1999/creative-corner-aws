const AWS = require('aws-sdk')
const config = require('config')

// 

try {
    const accessKeyId = config.get("accessKeyId") || null;
    if(accessKeyId){
        AWS.config.loadFromPath(__dirname + "/../config/default.json")
    }
} catch (err) {
    // do nothing
}





class s3Client {
    static s3 = undefined;
    static isInitialized = false;
    static getInstance(){
        if(this.isInitialized){
            return this.s3;
        }
        this.s3 = new AWS.S3({
            region: 'ap-south-1'
        })
        this.isInitialized = true;
        return this.s3;
    }
}

module.exports = {
    s3Client: s3Client
}