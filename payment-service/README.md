# payment-service

- listening to the OrderCreated event coming from RabbitMQ.
- processing the payment (simulating approval or failure).
- publishing the PaymentProcessed event with the payment status (approved or rejected).
