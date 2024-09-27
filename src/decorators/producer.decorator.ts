import {inject} from '@loopback/core';
import {producerKey} from '../sqskeys';

/**
 * get producer for the particular group id
 * @param groupId
 * */
export function producer(groupId?: string) {
  // if (exists)
  return inject(producerKey(groupId), {optional: false});

  // Return a no-op decorator if exists is false
  // return inject(producerKey('Transformed'), {optional: true});
}
