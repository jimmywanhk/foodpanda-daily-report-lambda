import { DateTime } from "luxon";
import axios from "axios";
import fs from "fs";

export default class FoodPandaHandler {
  getToken = async (username, password) => {
    const response = await axios
      .post("https://vp-bff.api.as.prd.portal.restaurant/auth/v4/token", {
        username: `${username}`,
        password: `${password}`,
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    return response.data;
  };

  createReport = async (accessToken) => {
    const response = await axios
      .post(
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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });

    return response.data;
  };

  downloadReport = async (accessToken, url) => {
    const writer = fs.createWriteStream("/tmp/temp.xlsx");

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error);
        throw error;
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  };
}
