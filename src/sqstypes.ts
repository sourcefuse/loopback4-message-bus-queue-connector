import {
  MessageAttributeValue,
  SQSClientConfig as AWSSQSClientConfig,
} from '@aws-sdk/client-sqs';

export interface SqsClientOptions {
  clientConfig: SQSClientConfig;
  queueUrls?: string[];
  initObservers?: boolean;
}

export type SQSClientConfig = AWSSQSClientConfig;

export interface IStreamDefinitionSQS {
  topic: string;
  queueUrl: string;
  messages: {};
}

export type TopicForStream<Stream extends IStreamDefinitionSQS> =
  Stream['topic'];
export type EventsInStream<Stream extends IStreamDefinitionSQS> =
  keyof Stream['messages'];
export type QueueUrlForStream<Stream extends IStreamDefinitionSQS> =
  Stream['queueUrl'];

export interface IConsumer<
  Stream extends IStreamDefinitionSQS,
  K extends EventsInStream<Stream>,
> {
  topic: TopicForStream<Stream>;
  queueUrl?: QueueUrlForStream<Stream>;
  event: K;
  handler: StreamHandler<Stream, K>;
}

export interface Producer<Stream extends IStreamDefinitionSQS> {
  send<Type extends EventsInStream<Stream>>(
    type: Type,
    payload: Stream['messages'][Type][],
    options?: SqsSendMessageOptions,
  ): Promise<void>;
}

export type ProducerFactoryType<Stream extends IStreamDefinitionSQS> = (
  topic: Stream['topic'],
) => Producer<Stream>;

export type StreamHandler<
  Stream extends IStreamDefinitionSQS,
  K extends EventsInStream<Stream>,
> = (payload: Stream['messages'][K]) => Promise<void>;

export interface SqsConfig {
  initObservers: boolean;
  clientConfig: AWSSQSClientConfig;
  queueUrl: string;
  maxNumberOfMessages: number;
  waitTimeSeconds: number;
}

export type SqsSendMessageOptions = {
  groupId?: string;
  delaySeconds?: number;
  messageAttributes?: Record<string, MessageAttributeValue>;
  messageDeduplicationId?: string;
};
