import { APIGatewayProxyResultV2, SQSEvent } from "aws-lambda";

export async function handler(
  event: SQSEvent
): Promise<APIGatewayProxyResultV2> {
  const events = event.Records.map((record: { body: string }) => {
    const body = JSON.parse(record.body) as {
      Subject: string;
      Message: string;
    };

    return { subject: body.Subject, message: body.Message };
  });

  console.log("events 👉", JSON.stringify(events, null, 2));

  return {
    body: JSON.stringify({ events }),
    statusCode: 200,
  };
}
