export default class Queue {
  constructor(name, client) {
    this.name = name;
    this.client = client;
    this.timeout = 0;
  }

  push(data) {
    this.client.rpush(this.name, data);
  }

  pop(callback) {
    this.client.blpop(this.name, this.timeout, callback);   
  }
}