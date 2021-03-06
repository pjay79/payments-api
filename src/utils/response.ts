import { APIGatewayProxyResultV2 } from "aws-lambda";

const response = (
  statusCode: number,
  body: object
): APIGatewayProxyResultV2 => {
  console.log(statusCode, body);

  return {
    statusCode: statusCode || 200,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default response;
