import * as cdk from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class BugTrackerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // QUEUE
    // queue stacking requests
    const queue = new sqs.Queue(this, "queue", {
      queueName: "sqs",
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // PROCESSOR
    // lambda functions: reciever of events from SQS queue and send it to server
    const processor = new lambda.Function(this, "processor", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "processor.handler",
    });

    // send events from SQS to our lambda processor
    processor.addEventSource(new SqsEventSource(queue));

    // Authentication for the API => QUEUE
    const integrationRole = new iam.Role(this, "integrationRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    queue.grantSendMessages(integrationRole);

    // Integration API => QUEUE
    const sendMessageIntegration = new apigateway.AwsIntegration({
      service: "sqs",
      path: queue.queueName,
      integrationHttpMethod: "POST",
      options: {
        credentialsRole: integrationRole,
        requestParameters: {
          "integration.request.header.Content-Type":
            "'application/x-www-form-urlencoded'",
        },
        requestTemplates: {
          "application/json": "Action=SendMessage&MessageBody=$input.body",
        },
        integrationResponses: [
          { statusCode: "200" },
          { statusCode: "400" },
          { statusCode: "500" },
        ],
      },
    });

    // API ENDPOINT
    const api = new apigateway.RestApi(this, "api", {});
    const eventsEndpoint = api.root.addResource("events");
    eventsEndpoint.addMethod("POST", sendMessageIntegration);

    new cdk.CfnOutput(this, "EventsEndpoint", {
      value: `${api.url.slice(0, -1)}${eventsEndpoint.path}`,
    });
  }
}
