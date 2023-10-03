import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();

const createRawEmail = async () => {
  const fromEmail = process.env.EMAIL_FROM;
  const toEmail = process.env.EMAIL_TO;
  const subject = "FoodPanda 熊貓每日報表";
  const body = "";
  const attachmentPath = "/tmp/temp.xlsx";

  const fileName = `${currentYear}年${currentMonth}月${currentDay}日.xlsx`;
  const fileContent = fs.readFileSync(attachmentPath);

  const rawEmail =
    `From: ${fromEmail}\n` +
    `To: ${toEmail}\n` +
    `Subject: ${subject}\n` +
    `MIME-Version: 1.0\n` +
    `Content-Type: multipart/mixed; boundary="NextPart"\n\n` +
    `--NextPart\n` +
    `Content-Type: text/plain\n\n` +
    `${body}\n\n` +
    `--NextPart\n` +
    `Content-Type: application/octet-stream\n` +
    `Content-Disposition: attachment; filename="${fileName}"\n` +
    `Content-Transfer-Encoding: base64\n\n` +
    `${fileContent.toString("base64")}\n` +
    `--NextPart--`;

  return rawEmail;
};

const sendEmailWithAttachment = async () => {
  const params = {
    RawMessage: {
      Data: await createRawEmail(),
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
