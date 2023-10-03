import {
  getToken,
  createReport,
  downloadReport,
} from "./modules/FoodPandaHandler.mjs";
import { sendEmailWithAttachment } from "./modules/SESHandler.mjs";
import { getSSMParameter } from "./modules/SSMParameterHandler.mjs";

export const handler = async (event) => {
  // TODO implement
  const username = await getSSMParameter("/FoodPanda/Username");
  const password = await getSSMParameter("/FoodPanda/Password");
  const toEmails = await getSSMParameter("/FoodPanda/ToEmails");
  const response1 = await getToken(username, password);
  const response2 = await createReport(response1.accessToken);
  await downloadReport(response1.accessToken, response2.reportDownloadURL);
  await sendEmailWithAttachment(toEmails);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

//for local run
/*async function main() {
  const username = await getSSMParameter("/FoodPanda/Username");
  const password = await getSSMParameter("/FoodPanda/Password");
  const toEmails = await getSSMParameter("/FoodPanda/ToEmails");
  const response1 = await getToken(username, password);
  const response2 = await createReport(response1.accessToken);
  await downloadReport(response1.accessToken, response2.reportDownloadURL);
  await sendEmailWithAttachment(toEmails);
}

main();*/
