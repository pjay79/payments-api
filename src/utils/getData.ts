import { APIGatewayProxyEventV2 } from "aws-lambda";

const getData = (event: APIGatewayProxyEventV2) => {
  try {
    if (!event.body || typeof event.body !== "string") {
      throw new Error("Not a string");
    }
    return JSON.parse(event.body);
  } catch (e) {
    return {};
  }
};

export default getData;
