import { APIGatewayProxyEventV2 } from "aws-lambda";

const checkPermissions = (event: APIGatewayProxyEventV2) => {
  try {
    const apiKey = process.env.X_PAYMENTS_API_KEY;
    console.info(event.headers);

    if (event.headers["X-Payments-API-Key"] !== apiKey) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default checkPermissions;
