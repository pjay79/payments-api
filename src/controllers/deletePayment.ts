import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import { response } from "utils/index";
import { db, tableName } from "models/payments";

const deletePayment: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters.id;

    const payment = await db
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

    return response(200, payment);
  } catch (e) {
    console.error("[PAYMENTS API] - DELETE", e);

    const error = {
      message: "Unable to delete payment",
      error: e.message,
    };

    return response(404, error);
  }
};

export default deletePayment;
