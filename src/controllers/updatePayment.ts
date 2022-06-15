import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import { getData, response } from "utils/index";
import { db, tableName } from "models/payments";
import checkPermissions from "middleware/checkPermissions";
import HttpException from "exceptions/HttpException";

const updatePayment: Handler = async (
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
    const data = getData(event);

    const payment = await db
      .update({
        TableName: tableName,
        Key: { id },
        UpdateExpression:
          "set customer = :customer, amount = :amount, product = :product",
        ExpressionAttributeValues: {
          ":customer": data.customer,
          ":amount": data.amount,
          ":product": data.product,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
      .then((response) => response.Attributes)
      .catch((e) => {
        throw new Error(e);
      });

    return response(200, payment);
  } catch (e) {
    console.error("[PAYMENTS API] - UPDATE", e);

    const error = {
      message: "Unable to update payment",
      error: e.message,
    };

    return response(e.statusCode || 500, error);
  }
};

export default updatePayment;
