
const webpush = require('web-push');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

webpush.setVapidDetails(
    process.env['PushSubject'],
    process.env['PushPublicKey'],
    process.env['PushPrivateKey']
);

const getSubscriptions = async (topic) => {
    var params = {
        ExpressionAttributeValues: { ":topic": { S: topic } },
        KeyConditionExpression: "topic = :topic",
        ProjectionExpression: "subscription",
        TableName: process.env['SubscriptionsTable']
    };

    return new Promise((ok, err) => {
        dynamodb.query(params, function (e, data) {
            if (e) err(e);
            else ok(data);
        })
    });
}

exports.handler = async (event) => {
    const { topic, title, text } = JSON.parse(event.Records[0].Sns.Message);
    const { Items } = await getSubscriptions(topic);
    const promises = [];
    Items.forEach(d => {
        const subscription = JSON.parse(d.subscription.S);
        let result = webpush.sendNotification(subscription, JSON.stringify({ title, text }));
        promises.push(result);
    });

    await Promise.all(promises);
};