import DeliverooHandler from "./DeliverooHandler.mjs";
import FoodPandaHandler from "./FoodPandaHandler.mjs";
import { sendEmailWithAttachment } from "./SESHandler.mjs";
import { getSSMParameter } from "./SSMParameterHandler.mjs";

export default class MainProcess {
  run = async () => {
    const reTry = 3;
    const username = await getSSMParameter("/YingDimDailyReport/Username");
    const password = await getSSMParameter("/YingDimDailyReport/Password");
    const toEmails = await getSSMParameter("/YingDimDailyReport/ToEmails");
    //const toEmails = "wankaho@hotmail.com"; //await getSSMParameter("/YingDimDailyReport/ToEmails");

    //Download Deliveroo Report
    const deliverooHandler = new DeliverooHandler();
    let response1 = await deliverooHandler.getToken(username, password);
    let response2 = await deliverooHandler.createReport(response1.access_token);
    await this.delay(5000);

    for (let i = 0; i < reTry; i++) {
      console.log("i=" + i);

      try {
        await deliverooHandler.downloadReport(
          response1.access_token,
          response2.drn_id
        );
        break;
      } catch (error) {
        console.log("error when downloading deliveroo report");
        await this.delay(60000);
      }
    }
    console.log("deliveroo report downloaded");

    ////
    ////Download FoodPanda Report
    const foodPandaHandler = new FoodPandaHandler();
    response1 = await foodPandaHandler.getToken(username, password);
    response2 = await foodPandaHandler.createReport(response1.accessToken);
    await this.delay(5000);

    for (let i = 0; i < reTry; i++) {
      console.log("i=" + i);

      try {
        await foodPandaHandler.downloadReport(
          response1.accessToken,
          response2.reportDownloadURL
        );
        break;
      } catch (error) {
        console.log("error when downloading foodPanda report");
        await this.delay(60000);
      }
    }

    console.log("foodPanda report downloaded");

    //Send Email
    await sendEmailWithAttachment(toEmails);
  };

  delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
}
