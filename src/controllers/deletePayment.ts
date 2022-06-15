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

const deletePayment: Handler = async (
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

    await db
      .delete({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise()
      .catch((e) => {
        throw new Error(e);
      });

    return response(200, {});
  } catch (e) {
    console.error("[PAYMENTS API] - DELETE", e);

    const error = {
      message: "Unable to delete payment",
      error: e.message,
    };

    return response(e.statusCode || 404, error);
  }
};

export default deletePayment;
