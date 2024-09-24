# Message bus queue connectors
This is the package for the message bus queue connectors component for LoopBack 4 applications.
It provides components to work with queues such as SQS, Redis(NodeBull)

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install MessageBusQueueConnectorsComponent using `npm`;

```sh
$ [npm install | yarn add] message-bus-queue-connectors
```

## Basic Use

Configure and load MessageBusQueueConnectorsComponent in the application constructor
as shown below.

### SQS
```ts
import {MessageBusQueueConnectorsComponent, MessageBusQueueConnectorsComponentOptions, DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS} from 'message-bus-queue-connectors';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super();
    this.bind(SqsClientBindings.SqsClient).to(
      options.sqsConfig
    );
    
    this.component(MessageBusQueueConnectorsComponent);
    // ...
  }
  // ...
}
```

### Redis
```ts
// WIP
```

## Product and consume SQS event
Topic: `topicTransform` <br />
Event: `QueueEvent.Transform` <br />

#### Consumer setup
```ts
import {asConsumer, EventsInStream, IConsumer} from '@sourceloop/queue';

@injectable(asConsumer)
export class MyQueueConsumerService
  implements IConsumer<SqsTransformStream, EventsInStream<SqsTransformStream>>
{
  // register consumer for particular topic
  topic: string = topicTransform; 
  // register consumer for particular event
  event: EventsInStream<SqsTransformStream> = QueueEvent.Transform; 
  
  async handler(payload: AnyObject) {
    // handle your queue payload here
  }
}

```

#### Producer setup
```ts
@injectable({scope: BindingScope.TRANSIENT})
export class ProducerService {
  constructor(
    @producer(topicTransform)
    private readonly sqsProducer?: Producer<SqsTransformStream>,
  ) {}
  
  async extract() {
    await this.sqsProducer.send(QueueEvent.Transform, [/*Payload...*/]);
  }
}
```
