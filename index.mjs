import DeliverooHandler from "./modules/DeliverooHandler.mjs";
import FoodPandaHandler from "./modules/FoodPandaHandler.mjs";
import { sendEmailWithAttachment } from "./modules/SESHandler.mjs";
import { getSSMParameter } from "./modules/SSMParameterHandler.mjs";

export const handler = async (event) => {
  // TODO implement
  const username = await getSSMParameter("/YingDimDailyReport/Username");
  const password = await getSSMParameter("/YingDimDailyReport/Password");
  const toEmails = await getSSMParameter("/YingDimDailyReport/ToEmails");

  //Download Deliveroo Report
  const deliverooHandler = new DeliverooHandler();
  let response1 = await deliverooHandler.getToken(username, password);
  let response2 = await deliverooHandler.createReport(response1.access_token);
  await deliverooHandler.downloadReport(
    response1.access_token,
    response2.drn_id
  );

  ////Download FoodPanda Report
  const foodPandaHandler = new FoodPandaHandler();
  response1 = await foodPandaHandler.getToken(username, password);
  response2 = await foodPandaHandler.createReport(response1.accessToken);
  await foodPandaHandler.downloadReport(
    response1.accessToken,
    response2.reportDownloadURL
  );

  //Send Email
  await sendEmailWithAttachment(toEmails);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

//for local run
/*
async function main() {
  const username = await getSSMParameter("/YingDimDailyReport/Username");
  const password = await getSSMParameter("/YingDimDailyReport/Password");
  const toEmails = await getSSMParameter("/YingDimDailyReport/ToEmails");

  //Download Deliveroo Report
  const deliverooHandler = new DeliverooHandler();
  let response1 = await deliverooHandler.getToken(username, password);
  let response2 = await deliverooHandler.createReport(response1.access_token);
  await deliverooHandler.downloadReport(
    response1.access_token,
    response2.drn_id
  );

  ////Download FoodPanda Report
  const foodPandaHandler = new FoodPandaHandler();
  response1 = await foodPandaHandler.getToken(username, password);
  response2 = await foodPandaHandler.createReport(response1.accessToken);
  await foodPandaHandler.downloadReport(
    response1.accessToken,
    response2.reportDownloadURL
  );

  //Send Email
  await sendEmailWithAttachment(toEmails);
}

main();
*/
