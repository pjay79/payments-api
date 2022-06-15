import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import { response } from "utils/index";
import { db, tableName } from "models/payments";
import checkPermissions from "middleware/checkPermissions";
import HttpException from "exceptions/HttpException";

const getPayment: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResultV2> => {
  try {
    const isAuthorized = checkPermissions(event);

    if (!isAuthorized) {
      throw new HttpException("Unauthorized request", 403);
    }

    const { id } = event.pathParameters;

    const payment = await db
      .get({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise()
      .then((response) => response.Item)
      .catch((e) => {
        throw new Error(e);
      });

    return response(200, payment);
  } catch (e) {
    console.error("[PAYMENTS API] - GET", e);

    const error = {
      message: "Unable to get payment",
      error: e.message,
    };

    return response(e.statusCode || 500, error);
  }
};

export default getPayment;
