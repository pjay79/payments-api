import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import { response } from "utils/index";
import { db, tableName } from "models/payments";

const listPayments: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResultV2> => {
  try {
    const payments = await db
      .scan({ TableName: tableName })
      .promise()
      .then((response) => response.Items)
      .catch((e) => {
        throw new Error(e);
      });

    return response(200, payments);
  } catch (e) {
    console.error("[PAYMENTS API] - LIST", e);

    const error = {
      message: "Unable to get payments",
      error: e.message,
    };

    return response(404, error);
  }
};

export default listPayments;
