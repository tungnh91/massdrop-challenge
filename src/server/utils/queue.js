export default class Queue {
  constructor(name, client) {
    this.name = name;
    this.client = client;
    this.timeout = 0;
  }
  
/**
 * Insert all the specified values at the tail of the list stored at key
 */
  push(data) {
    this.client.rpush(this.name, data);
  }

/**
 * An element is popped from the head of the list and returned to the caller together with the key it was popped from.
 */
  pop(callback) {
    this.client.blpop(this.name, this.timeout, callback);   
  }
}