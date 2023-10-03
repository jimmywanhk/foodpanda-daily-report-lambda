import { DateTime } from "luxon";
import axios from "axios";
import fs from "fs";

const getToken = async (username, password) => {
  const response = await axios.post(
    "https://vp-bff.api.as.prd.portal.restaurant/auth/v4/token",
    {
      username: `${username}`,
      password: `${password}`,
    }
  );
  return response.data;
};

const createReport = async (accessToken) => {
  const response = await axios.post(
    "https://vos-api.ap.prd.portal.restaurant/v1/vendors/reports/eod/export",
    {
      locale: "zh-Hant-HK",
      format: "XLSX",
      global_vendor_codes: ["FP_HK;yjui"],
      from: DateTime.now().toFormat("yyyy-MM-dd"),
      to: DateTime.now().toFormat("yyyy-MM-dd"),
    },
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const downloadReport = async (accessToken, url) => {
  const writer = fs.createWriteStream("/tmp/temp.xlsx");

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

export { getToken, createReport, downloadReport };
