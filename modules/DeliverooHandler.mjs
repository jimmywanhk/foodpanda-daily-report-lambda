import { DateTime } from "luxon";
import axios from "axios";
import fs from "fs";

export default class DeliverooHandler {
  getToken = async (username, password) => {
    const response = await axios
      .post("https://restaurant-hub.deliveroo.net/api/session", {
        email: `${username}`,
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
        "https://restaurant-hub.deliveroo.net/api/reporting_platform/reports",
        {
          restaurant_drn_ids: ["b9e35025-601c-4a90-a234-656c47c827db"],
          time_zone: "Asia/Hong_Kong",
          report_type: "orders",
          order_source: "core",
          start_date: DateTime.now().toFormat("yyyy-MM-dd"),
          end_date: DateTime.now().toFormat("yyyy-MM-dd"),
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

  downloadReport = async (accessToken, drn_id) => {
    const writer = fs.createWriteStream("/tmp/temp.csv");
    console.log("drn_id=" + drn_id);

    const response = await axios({
      url: `https://restaurant-hub.deliveroo.net/api/reporting_platform/reports/${drn_id}/download`,
      method: "GET",
      responseType: "stream",
      headers: {
        Cookie: `token=${accessToken}`,
      },
      withCredentials: true,
    }).catch((error) => {
      if (error.response) {
        console.log(error);
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  };
}
