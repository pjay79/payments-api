import { APIGatewayProxyEventV2 } from "aws-lambda";
import HttpException from "exceptions/HttpException";

const checkPermissions = (event: APIGatewayProxyEventV2): boolean => {
  try {
    const apiKey = process.env.X_PAYMENTS_API_KEY;

    if (event.headers["X-Payments-API-Key"] !== apiKey) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    throw new HttpException("Server error", 500);
  }
};

export default checkPermissions;
