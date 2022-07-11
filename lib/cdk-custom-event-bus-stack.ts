import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {EventBus, Rule} from "aws-cdk-lib/aws-events";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {Policy, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";


export class CdkCustomEventBusStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        //Creating a custom event bus
        const customEventBus = new EventBus(this, "CustomEventBus", {
            eventBusName: "customer-subscription-bus"
        });

        //Custom event publisher lambda
        //publish events to the custom event bus
        const customEventPublisherLambda = new Function(this, "CustomEventPublisherLambda",{
            code: Code.fromAsset(path.join(__dirname, '../lambda/event-publisher-lambda')),
            handler: "index.handler",
            runtime: Runtime.NODEJS_14_X,
            environment: {
                EVENT_BUS_ARN: customEventBus.eventBusArn
            }
        });

        //Lambda needs permission to put events to event bus
        const policyStatement = new PolicyStatement({
            actions: ["events:Put*"],
            resources: [customEventBus.eventBusArn]
        })

        customEventPublisherLambda.role?.attachInlinePolicy(
            new Policy(this, "EventBusPolicy", {
                statements: [
                    policyStatement
                ]
            })
        )

        //Lambda function to process events from custom event bus
        const eventConsumerLambda = new Function(this, "CustomEventConsumerLambda",{
            code: Code.fromAsset(path.join(__dirname, '../lambda/event-consumer-lambda')),
            handler: "index.handler",
            runtime: Runtime.NODEJS_14_X,
        })

        //Event rule to trigger the event consumer lambda function (eventConsumerLambda)
        const eventRule = new Rule(this, "EventRule", {
            eventBus: customEventBus,
            eventPattern: {
                source: ["custom.eventSource"],
                detail:{
                    action: ["newCustomer"],
                    type: ["Gold"],
                }
            }
        });

        eventRule.addTarget(new LambdaFunction(eventConsumerLambda))

    }
}
