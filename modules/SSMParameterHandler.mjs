import AWS from "aws-sdk";
import dotenv from "dotenv";
//for local run
/*dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});*/

const ssm = new AWS.SSM();

const getSSMParameter = async (path) => {
  const data = await ssm.getParameter({ Name: `${path}` }).promise();
  const parameterValue = data.Parameter.Value;
  return parameterValue;
};

export { getSSMParameter };
