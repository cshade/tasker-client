<template>
<div id="app">

<h1>Tasker Console</h1>

<h2>Due Tasks</h2>

  <ul>
    <li v-show="displayDueTasks.length == 0">There are no tasks to display.
    <li v-for="(task, index) in displayDueTasks">
      <button class="btn btn-dark btn-sm" v-on:click="toggleDone(task.id)">done</button>
      <strong>{{ task.name }}</strong>, <span v-bind:class="{ 'due-today': getDueToday(task.id), 'overdue': getOverdue(task.id) }">Due {{ displayDate(task.id) }}</span>
      <button class="btn btn-light btn-sm" v-on:click="toggleShowDetail(task.id)">details</button>

      <detail-display
        v-show="showDetail == task.id"
        v-bind:task="task"
        v-bind:key="task.id">
      </detail-display>

    </li>
  </ul>

  <span class="filter-label">Filter:</span>
  <button
      v-bind:class="{ 'btn btn-outline-primary col-sm-2': (filterKey == 'all'), 'btn btn-primary col-sm-2': (filterKey != 'all') }"
      v-on:click="filterKey = 'all'">
      All Due
  </button>
  <button
      v-bind:class="{ 'btn btn-outline-danger col-sm-2': (filterKey == 'overdue'), 'btn btn-danger col-sm-2': (filterKey != 'overdue') }"
      v-on:click="filterKey = 'overdue'">
      Overdue
  </button>
  <button
      v-bind:class="{ 'btn btn-outline-warning col-sm-2': (filterKey == 'today'), 'btn btn-warning col-sm-2': (filterKey != 'today') }"
      v-on:click="filterKey = 'today'">
      Due Today
  </button>
  <button
      v-bind:class="{ 'btn btn-outline-secondary col-sm-2': (filterKey == 'tomorrow'), 'btn btn-secondary col-sm-2': (filterKey != 'tomorrow') }"
      v-on:click="filterKey = 'tomorrow'">
      Due Tomorrow
  </button>

  <hr>

  <h2>All Done</h2>
    <ul>
      <li v-show="displayDoneTasks.length == 0">There are no tasks marked as done.</li>
      <li v-for="(task, index) in displayDoneTasks">
        <button class="btn btn-dark btn-sm" v-on:click="deleteTask(task.id)">delete</button>
        <button class="btn btn-light btn-sm" v-on:click="toggleDone(task.id)">not done</button>
        {{ task.name }}
      </li>
    </ul>

  <hr>

  <h2>Create a New Task</h2>
    <ul>
      <li class="error" v-show="createFormError">{{ createFormErrorMsg }}
      <li>Task Name: <input id="new-task-name" type="text" v-model.trim="newTaskName" placeholder="Task Name"></li>
      <li>Description: <input id="new-task-descr" type="text" v-model.trim="newTaskDescr" placeholder="Description"></li>
      <li>Due: <input id="new-task-due" type=date v-model.trim="newTaskDue"></li>
      <button class="btn btn-primary col-sm-2" v-on:click="addTask">{{ newTaskActionText }}</button>
    </ul>

</div>
</template>

<script>
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'

// URI of the Task API
const taskBaseURI = 'http://localhost:8082/api/tasks'

export default {
  name: 'app',
  data () {
    return {
      // an array of all tasks
      tasks: [],

      // convenience variables for the create task form
      newTaskName: '',
      newTaskDescr: '',
      newTaskDue: '',

      // button text for the create task form
      newTaskActionText: 'Create',

      // for the filter action on due tasks
      filterKey: 'all',

      // a task id, for display of its detail
      showDetail: '0',

      // create task form error message
      createFormError: false,
      createFormErrorMsg: '',
    }
  },
  computed: {
      // only the due tasks, filtered if chosen in the UI
      displayDueTasks() {
        if (!!this.tasks) {
          if (this.filterKey == 'overdue') {
              return this.tasks.filter(task => moment(task.due, "YYYY-MM-DD").isBefore(moment(), 'day')).filter(task => !task.done)
          } else if (this.filterKey == 'today') {
              return this.tasks.filter(task => moment(task.due, "YYYY-MM-DD").isSame(moment(), 'day')).filter(task => !task.done)
          } else if (this.filterKey == 'tomorrow') {
              let tempMoment = moment().add(1, 'days');
              return this.tasks.filter(task => moment(task.due, "YYYY-MM-DD").isSame(tempMoment, 'day')).filter(task => !task.done)
          } else {
            return this.tasks.filter(task => !task.done)
          }
        }
      },
      // only the done tasks
      displayDoneTasks() {
        return this.tasks.filter(task => task.done)
      },
  },
  methods: {
        // sets the showDetail variable to a given task's id
        toggleShowDetail(taskId) {
          if (!!taskId) {
            (this.showDetail == taskId) ? this.showDetail = 0 : this.showDetail = taskId;
          } else {
            this.showDetail = 0;
          }
        },
        // return overdue state of a given task
        getOverdue(taskId) {
          if (!!taskId) {
            // find this task in the array
            let taskToEvaluate = this.tasks.filter( taskToEvaluate => {
              return taskToEvaluate.id == taskId; })[0];

            return moment(taskToEvaluate.due, "YYYY-MM-DD").isBefore(moment(), 'day')
          } else {
            return false;
          }
        },
        // return due today state of a given task
        getDueToday(taskId) {
          if (!!taskId) {
            // find this task in the array
            let taskToEvaluate = this.tasks.filter( taskToEvaluate => {
              return taskToEvaluate.id == taskId; })[0];
            
            return moment(taskToEvaluate.due, "YYYY-MM-DD").isSame(moment(), 'day')
          } else {
            return false;
          }
        },
        // return due tomorrow state of a given task
        getDueTomorrow(taskId) {
          if (!!taskId) {
            // find this task in the array
            let taskToEvaluate = this.tasks.filter( taskToEvaluate => {
              return taskToEvaluate.id == taskId; })[0];
            // create a tomorrow moment object for comparison
            let tempMoment = moment().add(1, 'days');
            return moment(taskToEvaluate.due, "YYYY-MM-DD").isSame(tempMoment, 'day')
          } else {
            return false;
          }
        },
        // friendly format for display of this task's date
        displayDate(taskId) {
          if (!!taskId) {
            // find this task in the array
            let taskToEvaluate = this.tasks.filter( taskToEvaluate => {
              return taskToEvaluate.id == taskId; })[0];
            let tempDateDisplay = '';
            if (moment(taskToEvaluate.due, "YYYY-MM-DD").isSame(moment(), 'day')) {
              tempDateDisplay = "Today";
            } else {
              tempDateDisplay = moment(taskToEvaluate.due, "YYYY-MM-DD").format("dddd MMMM DD");
            }
            // use moment.js to manipulate display
            return tempDateDisplay
          } else {
            console.log("displayDate() error: invalid task id");
            return "Date format error";
          }
        },
        // create a new task in the system, via the Task API
        addTask() {
          // confirm that we have data for a new task
          if (!!this.newTaskName &&
              !!this.newTaskDescr && 
              !!this.newTaskDue) {

            // clean date format
            this.newTaskDue = moment(this.newTaskDue).format('YYYY-MM-DD');

            axios.post( taskBaseURI + '/add' , {
                  name: this.newTaskName,
                  description: this.newTaskDescr,
                  due: this.newTaskDue
                  })
                .then( response => {
                console.log(`addTask(): NEW COMPLETE SET OF TASKS:\n` + JSON.stringify(response.data));
                this.tasks = response.data
              })
              .catch(function (error) {
                console.log(error);
              })        

            // clear form fields
            this.newTaskName = '';
            this.newTaskDescr = '';
            this.newTaskDue = '';
            this.createFormError = false; // clear any error message
          } else {
            this.createFormError = true;
            this.createFormErrorMsg = 'Please complete the form to create a task.';
            console.log("addTask() error: expected new task values not present ")
          }
        },
        // toggles the "done" state of a given task, via the Task API
        toggleDone(taskId) {
          if (!!taskId) {
            // find the task in the array
            let taskToUpdate = this.tasks.filter( taskToUpdate => {
              return taskToUpdate.id == taskId; })[0];
            taskToUpdate.done = !taskToUpdate.done;

            const config = {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            };
            axios.post( 
                taskBaseURI + '/update/' + taskId, 
                taskToUpdate,
                config)
              .then( response => {
                console.log(`toggleDone(): NEW COMPLETE SET OF TASKS:\n` + JSON.stringify(response.data));
                this.tasks = response.data
              })
              .catch(function (error) {
                console.log(error);
              })
          } else {
            console.log("toggleDone() error: invalid task id");
          }
        },
        deleteTask(taskId) {
          if (!!taskId) {
            axios.delete( taskBaseURI + '/delete/' + taskId)
                .then( response => {
                console.log(`deleteTask(): NEW COMPLETE SET OF TASKS:\n` + JSON.stringify(response.data));
                this.tasks = response.data
              })
              .catch(function (error) {
                console.log(error);
              })        
          } else {
            console.log("deleteTask() error: invalid task id");
          }
        },
    },
  // retrieve all the existing tasks via the Task API
  mounted: function () {
      axios.get(taskBaseURI)
            .then(response => {
              console.log(JSON.stringify(response.data))
              this.tasks = response.data}
          )
          .catch(function (error) {
            console.log("mounted: error communicating with Task API");
            console.log(error);
          });
  },
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

h1, h2 {
  font-weight: normal;
  margin: 5px 20px;
}

h1 {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 10px;
}

a {
  color: #42b983;
}

button {
  margin: 5px 5px;
}

.overdue, .error {
  color: #dc3545;
  font-weight: 700;
}

.due-today {
  color: #ffc107;
  font-weight: 700;
}

.filter-label {
  margin: 5px 5px;
  font-weight: 700;  
}

.filter-button {
  width: 15%;
}

</style>
