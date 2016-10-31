import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

let day = 1000*60*60*24;

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket, s3) {
    this.$http = $http;
    this.socket = socket;
    this.s3 = s3;
    this.$file = null;
    this.base = 0.7;
    this.times = [{text: '1 day', date: Date.now()},{text: '3 days', date: Date.now()},{text: '5 days', date: Date.now()}];
    this.selected_time = '1 day';
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  getDate(){
    let date = Date.now().valueOf();
    switch(this.selected_time){
      case '1 day':
        date = new Date(date + day);
      case '3 days':
        date = new Date(date + 3 * day);
      case '5 days':
        date = new Date(date + 5 * day);
    }
    return date;
  }

  chooseFile($file){
    this.$file = $file;
    this.s3.getDuration(this.$file).then(seconds => {
      this.seconds = seconds;
      this.price = this.seconds * this.base / 60.0;
    })
  }

  deleteFile(){
    this.$file = null;
    this.seconds  = null;
  }

  sendFile(){
    // this.s3.
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('transcribeApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
