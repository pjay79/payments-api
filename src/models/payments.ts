import AWS, { DynamoDB } from "aws-sdk";

AWS.config.update({ region: process.env.REGION });

const { IS_OFFLINE } = process.env;

const dynamoDbOfflineOptions = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};

export const db = IS_OFFLINE
  ? new DynamoDB.DocumentClient(dynamoDbOfflineOptions)
  : new DynamoDB.DocumentClient();

export const tableName = `${process.env.STAGE}_payments`;
