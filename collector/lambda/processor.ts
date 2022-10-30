import { APIGatewayProxyResultV2, SQSEvent } from "aws-lambda";
import fetch from "node-fetch";

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

  await sendPost(events);

  console.log("events 👉", JSON.stringify(events, null, 2));

  return {
    body: JSON.stringify({ events }),
    statusCode: 200,
  };
}

async function sendPost(body: any) {
  const url = "http://localhost:8080/events";

  const params = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  await fetch(url, params);
}
