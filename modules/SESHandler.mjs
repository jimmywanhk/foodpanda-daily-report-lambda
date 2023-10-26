import { DateTime } from "luxon";
import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
//for local run
/*dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});*/
//

const ses = new AWS.SES();

const createRawEmail = async (toEmails) => {
  const fromEmail = "jimmyw@jimmythedeveloper.com"; //process.env.EMAIL_FROM;
  const toEmail = toEmails;
  //const toEmail = "wankaho@hotmail.com"; //toEmails;
  const subject = `型點 網上每日報表 ${DateTime.now().toFormat(
    "yyyy年MM月dd日"
  )}`;
  const body = "";
  const attachmentPaths = ["/tmp/temp.csv", "/tmp/temp.xlsx"]; // Array of attachment paths

  const fileName1 = `Deliveroo 戶戶送每日報表 ${DateTime.now().toFormat(
    "yyyy年MM月dd日"
  )}.csv`;
  const fileContent1 = fs.readFileSync(attachmentPaths[0]);

  const fileName2 = `FoodPanda 熊貓每日報表 ${DateTime.now().toFormat(
    "yyyy年MM月dd日"
  )}.xlsx`;
  const fileContent2 = fs.readFileSync(attachmentPaths[1]);

  const rawEmail =
    `From: ${fromEmail}\n` +
    `To: ${toEmail}\n` +
    `Subject: ${subject}\n` +
    `MIME-Version: 1.0\n` +
    `Content-Type: multipart/mixed; boundary="NextPart"\n\n` +
    `--NextPart\n` +
    `Content-Type: text/plain\n\n` +
    `${body}\n\n`;

  const attachments =
    `--NextPart\n` +
    `Content-Type: application/octet-stream\n` +
    `Content-Disposition: attachment; filename="${fileName1}"\n` +
    `Content-Transfer-Encoding: base64\n\n` +
    `${fileContent1.toString("base64")}\n` +
    `--NextPart\n` +
    `Content-Type: application/octet-stream\n` +
    `Content-Disposition: attachment; filename="${fileName2}"\n` +
    `Content-Transfer-Encoding: base64\n\n` +
    `${fileContent2.toString("base64")}\n` +
    `--NextPart--`;

  return rawEmail + attachments;
};

const sendEmailWithAttachment = async (toEmails) => {
  const params = {
    RawMessage: {
      Data: await createRawEmail(toEmails),
    },
  };

  try {
    const data = await ses.sendRawEmail(params).promise();
    console.log("Email sent:", data.MessageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendEmailWithAttachment };
