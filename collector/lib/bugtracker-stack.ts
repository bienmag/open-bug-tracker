import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as destinations from "@aws-cdk/aws-lambda-destinations";

export class BugTrackerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // queue stacking requests
    const queue = new sqs.Queue(this, "queue", {
      queueName: "sqs",
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // lambda functions: reciever of events from API endpoint
    const reciever = new lambda.Function(this, "reciever", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "reciever.handler",
      onSuccess: new destinations.SqsDestination(queue),
    });

    // lambda functions: reciever of events from SQS queue and send it to server
    const processor = new lambda.Function(this, "processor", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "processor.handler",
    });

    // send events from SQS to our lambda processor
    processor.addEventSource(new SqsEventSource(queue));

    // API endpoint to recieve events from client
    const endpoint = new apigateway.RestApi(this, "api", {
      description: "example api gateway",

      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    // endpoint path  and method definition
    endpoint.root.addResource("{events}");
    endpoint.root.addMethod(
      "POST",
      new apigateway.LambdaIntegration(reciever, { proxy: true })
    );

    // create an Output for the API URL
    new cdk.CfnOutput(this, "apiUrl", { value: endpoint.url });
  }
}
