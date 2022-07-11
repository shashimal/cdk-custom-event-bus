const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION || 'us-east-1'
const eventbridge = new AWS.EventBridge()

exports.handler = async (event, context) => {
    const EVENT_BUS_ARN = process.env.EVENT_BUS_ARN
    const params = {
        Entries: [
            {
                // Event envelope fields
                Source: 'eventSource',
                EventBusName: EVENT_BUS_ARN,
                DetailType: 'subscribe',
                Time: new Date(),

                // Main event body
                Detail: JSON.stringify({
                    action: 'newCustomer',
                    type: 'Gold'
                })
            }
        ]
    }
    console.log('--- Params ---')
    console.log(params)
    const result = await eventbridge.putEvents(params).promise()

    console.log('--- Response ---')
    console.log(result)
}