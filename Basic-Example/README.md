# Tutorial with Rabbitmq

1. Fetch a Rabbitmq image and run a container
    ```docker pull rabbitmq:3-management
         docker run -it --name rabbitmq_tutorial -p 5672:5672 -p 8080:15672 -d rabbitmq:3-management
         docker exec -it rabbitmq_tutorial bash
         rabbitmqadmin -u guest -p guest declare vhost name=hello
         rabbitmqadmin -u guest -p guest -V hello declare exchange name=hello type=direct auto_delete=false durable=true internal=false
         rabbitmqadmin -u guest -p guest -V hello declare queue name=hello auto_delete=false durable=true
         rabbitmqadmin -u guest -p guest -V hello declare binding source=hello destination=hello routing_key=hello
    ```
    **NOTE:**
    We can test that the queue is working properly by publishing a message using:
    ```
    rabbitmqadmin -u guest -p guest -V hello publish routing_key=hello exchange=hello payload="hello world
    rabbitmqadmin list queues
    "
    ```
2. Execute script
    ```npm start```

    **NOTE:**  When the container is created, an account with the username `guest` is created and used for our purpose. This role has an `administrator` role.
