import MainProcess from "./modules/MainProcess.mjs";

export const handler = async (event) => {
  // TODO implement
  const mainProcess = new MainProcess();
  await mainProcess.run();

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

//for local run
/*const mainProcess = new MainProcess();
await mainProcess.run();*/
