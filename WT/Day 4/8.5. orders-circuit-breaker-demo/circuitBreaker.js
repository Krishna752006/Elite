
// Simple Circuit Breaker implementation
class CircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeout = 10000 }) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;

    this.failureCount = 0;
    this.state = "CLOSED"; // CLOSED | OPEN | HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(action) {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await action();
      this.success();
      return result;
    } catch (err) {
      this.failure();
      throw err;
    }
  }

  success() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  failure() {
    this.failureCount += 1;

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.resetTimeout;
      console.log("[CircuitBreaker] OPEN");
    }
  }
}

module.exports = CircuitBreaker;
