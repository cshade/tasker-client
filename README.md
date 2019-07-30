# Tasker

The UI of a simple task management tool, allowing an end user to create, manage and delete tasks using a web interface.

> Together with its separate Task API project, this is a demo of a containerized Node.js, Vue.js, MongoDB, RESTful API microservices application.

## Build and Run

In the project's root directory, run the API in a Docker Compose container:

``` bash
docker-compose up
```
The UI is then available at http://localhost:8080/

The above installs dependencies and builds a new Docker image if it does not already exist. Refer to the docker-compose.yml file, and the Deployment Notes section below.

### Dependency
This project assumes that the Task API is running at http://localhost:8082/api/tasks. The Task API microservices layer populates an initial set of tasks and handles data storage. Without the Task API running, the Tasker Console displays but is empty of task data.

## Built With
- [webpack-simple](https://github.com/vuejs-templates/webpack-simple): Webpack + vue-loader
- [axios](https://www.npmjs.com/package/axios): Promise based HTTP client
- [Bootstrap](https://getbootstrap.com/): Front-end framework along with [BootstrapVue](BootstrapVue), [JQuery](https://jquery.com/)
- [Moment.js](https://momentjs.com/): Parse, validate, manipulate, and display dates and times
- Docker and Docker Compose containerization (see Deployment Notes below)

## Deployment Notes
Both the front- and back-end projects of this demo are designed to run as multi-container Docker applications, within Docker Compose. Each project has a YAML file `docker-compose.yml` to configure the application's services as well as a Docker config file `Dockerfile`. From within the root directory of the project, you enter the single command of `docker-compose up` to create and start the services from the configuration.

In the absence of Docker, it may be run as:
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
And then in this configuration the UI is also available at http://localhost:8080/