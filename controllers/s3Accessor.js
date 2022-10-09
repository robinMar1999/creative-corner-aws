const config = require("config");
const aws = require("../providers/aws");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { v4: uuid} = require('uuid');


const getAllObjects = async () => {
  const s3Bucket = process.env.bucketName || config.get("bucketName");
  const s3 = aws.s3Client.getInstance();
  const response = await s3.listObjects({ Bucket : s3Bucket}).promise();
  return response.Contents;
}

const getProjects = async () => {
  const allObjects = await getAllObjects();
  const prefix = process.env.imagePrefixUri || config.get("imagePrefixUri");
  const fullKeyRegEx = /gallery\/([^\/]+)\/(.+[^\/]$)/
  const jsonRegEx = /.+\.json/
  const imageRegEx = /.+\.(jpg|jpeg|png)/
  let projects = new Object();
  allObjects.forEach(item => {
    let key = item.Key;
    let match = item.Key.match(fullKeyRegEx)
    if(match) {
      if(!projects[match[1]]){
        projects[match[1]] = {
          id: uuid(),
          info : new Object(),
          images: []
        }
      }
      if(match[2].match(jsonRegEx)) {
        projects[match[1]].hasJson = true
      } else if(match[2].match(imageRegEx)) {
        projects[match[1]].hasImages = true
      }
    }
  })

  for(let item of allObjects) {
    const match = item.Key.match(fullKeyRegEx);
    if(match) {
      const url = prefix + encodeURIComponent(item.Key);
      if(match[2].match(jsonRegEx)) {
        const response = await fetch(url);
        const data = await response.json();
        for(let key in data){
          projects[match[1]].info[key] = data[key];
        }
      } else if(match[2].match(imageRegEx)) {
        projects[match[1]].images.push(url);
      } else {
        console.error("Not a valid file: ", item.Key);
      }
    }
  }
  const projectsToDelete = [];
  for(let key in projects){
    if(!projects[key].hasImages || !projects[key].hasJson){
      projectsToDelete.push(key);
    }
  }
  for(let key of projectsToDelete){
    delete projects[key];
  }
  return projects;
};

const getOneImagePerProject = async () => {
  const allObjects = await getAllObjects();
  const fullImageKeyRegEx = /home\/[^\/]+\.(jpg|jpeg|png)/
  const prefix = process.env.imagePrefixUri || config.get("imagePrefixUri");
  const oneImagePerProject = [];
  for(let item of allObjects) {
    const match = item.Key.match(fullImageKeyRegEx)
    if(match){
      console.log("Matched: ", item.Key);
    } else {
      console.log("Not Matched: ", item.Key);
    }
    if(match && oneImagePerProject.length < 6) {
      const url = prefix + encodeURIComponent(item.Key);
      oneImagePerProject.push(url);
    }
  }
  return oneImagePerProject;
};

module.exports = {
  getProjectsWithImages: getProjects,
  getOneImagePerProject,
};
