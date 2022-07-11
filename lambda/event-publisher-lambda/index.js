const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION || 'us-east-1'
const eventBridge = new AWS.EventBridge()

exports.handler = async (event, context) => {
    const EVENT_BUS_ARN = process.env.EVENT_BUS_ARN
    const params = {
        Entries: [
            {
                Source: 'com.duleendra.customerapp',
                DetailType: 'customer-subscription',
                Time: new Date(),
                EventBusName: EVENT_BUS_ARN,
                Detail: JSON.stringify({
                    action: 'subscribe',
                    type: 'Gold'
                })
            }
        ]
    }
    console.log('--- Params ---')
    console.log(params)
    const result = await eventBridge.putEvents(params).promise()

    console.log('--- Response ---')
    console.log(result)
}