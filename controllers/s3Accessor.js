const config = require("config");
const aws = require("../providers/aws");

const getProjects = async () => {
  const s3 = aws.s3Client.getInstance();
  const response = await s3
    .listObjects({
      Bucket: process.env.bucketName || config.get("bucketName"),
    })
    .promise();
  const prefix = process.env.imagePrefixUri || config.get("imagePrefixUri");
  const projects = new Object();
  response.Contents.forEach((item) => {
    if (item.Size === 0) {
      const arr = item.Key.split("/");
      projects[arr[0]] = [];
    }
  });
  response.Contents.forEach((item) => {
    if (item.Size > 0) {
      const arr = item.Key.split("/");
      projects[arr[0]].push(prefix + encodeURIComponent(item.Key));
    }
  });
  return projects;
};

const getOneImagePerProject = async () => {
  const projects = await getProjects();
  const oneImagePerProject = [];
  for (let key in projects) {
    oneImagePerProject.push(projects[key][0]);
  }
  return oneImagePerProject;
};

module.exports = {
  getProjectsWithImages: getProjects,
  getOneImagePerProject,
};
