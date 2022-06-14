# Payments API

This is a demo Serverless Node.js API.

## How do I get set up?

Add a .env file with the following variables (replace region with your preferred value on AWS):

```
STAGE=development
REGION=ap-southeast-2
```

Then run the command:

`yarn run dev`

## Postman

In postman the endpoint to use when running locally is:

`http://localhost:2000/development/payments`

<img width="1015" alt="Screen Shot 2022-06-14 at 1 39 36 pm" src="https://user-images.githubusercontent.com/14052885/173488490-8e917cb8-9070-4581-b970-d5172f8070f0.png">
  
## Github Actions

In this example we have created 2 environments, development and production. These will store environment secrets. The AWS credentials are stored as repository secrets.

<img width="793" alt="Screen Shot 2022-06-14 at 1 28 55 pm" src="https://user-images.githubusercontent.com/14052885/173487508-2cd30367-e793-4e38-ad5b-e94638d68ae7.png">

In this example there are 2 separate workflows for each environment, with development tied to the develop branch, and production to the main branch.

<img width="1403" alt="Screen Shot 2022-06-14 at 1 29 20 pm" src="https://user-images.githubusercontent.com/14052885/173487499-0f4dec7f-f1a2-4ac6-a3fc-9cd7e8b8718b.png">

Note: the config.yml fetches an environment file from an S3 bucket.
