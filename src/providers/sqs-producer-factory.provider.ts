import {inject, Provider} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import {SqsClientBindings} from '../sqskeys';
import {
  IStreamDefinitionSQS,
  ProducerFactoryType,
  SqsConfig,
  SqsSendMessageOptions,
} from '../sqstypes';
import {ErrorKeys} from '../error-keys';

/* A factory provider that creates a producer factory
   which sends messages to an SQS queue using AWS SDK v3 */
export class SqsProducerFactoryProvider<T extends IStreamDefinitionSQS>
  implements Provider<ProducerFactoryType<T>>
{
  constructor(
    @inject(SqsClientBindings.SqsClient)
    private client: SqsConfig,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    private clientsqs = new SQSClient({}),
  ) {}

  value(): ProducerFactoryType<T> {
    return () => {
      return {
        send: async <Type extends keyof T['messages']>(
          type: Type,
          payload: T['messages'][Type][],
          options: SqsSendMessageOptions = {},
        ): Promise<void> => {
          try {
            await Promise.all(
              payload.map(async message => {
                const params: SendMessageCommandInput = {
                  QueueUrl: this.client.queueUrl,
                  MessageBody: JSON.stringify({
                    event: type,
                    data: message,
                  }),
                  MessageGroupId: options.groupId,
                  DelaySeconds: options.delaySeconds,
                  MessageAttributes: options.messageAttributes,
                  MessageDeduplicationId: options.messageDeduplicationId,
                };
                const command = new SendMessageCommand(params);
                const result = await this.clientsqs.send(command);

                this.logger.info(
                  `Message sent to SQS with ID: ${result.MessageId}`,
                );
              }),
            );
          } catch (e) {
            this.logger.error(
              `${ErrorKeys.PublishFailed}: ${JSON.stringify(e)}`,
            );
            throw e;
          }
        },
      };
    };
  }
}
