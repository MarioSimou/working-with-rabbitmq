# Work Queues

1. Fetch a Rabbitmq image and run a container
    ```docker pull rabbitmq:3-management
         docker run -it --name rabbitmq_tutorial -p 5672:5672 -p 8080:15672 -d rabbitmq:3-management
    ```
2. Execute each of the following commands in different terminals. 
    ```npm run producer```
    ```npm run worker```

    **NOTE:**  When the container is created, an account with the username `guest` is created and used for our purpose. This role has an `administrator` role.
