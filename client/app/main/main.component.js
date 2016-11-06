import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

let day = 1000*60*60*24;

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $q,$scope, $timeout,socket, s3, keen, Auth, User, Modal, anchorSmoothScroll) {
    this.$q = $q;
    this.$scope = $scope;
    this.Modal = Modal;
    this.$timeout = $timeout;
    this.$http = $http;
    this.socket = socket;
    this.s3 = s3;
    this.User = User;
    this.Auth = Auth;
    this.keen = keen;
    this.$file = null;
    this.$child_file = null;
    this.base = 70;
    this.anchorSmoothScroll = anchorSmoothScroll;
    this.times = [{text: '1 day', date: Date.now()},{text: '3 days', date: Date.now()},{text: '5 days', date: Date.now()}];
    this.selected_time = '1 day';
    this.checkout = "CHECKOUT";
    this.progress = 0;
    this.quote_text = "Our instant quote";
    this.keen.log('landed',{date: Date.now()});
    this.discount = 0;
    this.scrollTo =  (el) => {
      this.keen.log('pressedInstant',{date: Date.now()});
      this.anchorSmoothScroll.scrollTo(el);
    }
    $scope.$watch(()=>this.$child_file,(file) => {
      if(file){
        this.chooseFile(file);
      }
    })
  }

  processToken(token){
    this.charging = true;
    this.checkout = "PROCESSING...";
    this.progress = 0;
    this.keen.log('pressedOrder',{date: Date.now(), email: token.email});
    let old_user = this.User.find({email: token.email})
    old_user.$promise
    .then(_=>{
      if(!old_user.found){
        this.discount = 25;
        let scope = {
          modal: {
            title: 'Hello first timer!',
            text: `You get a 25% discount of your first order. This means you get £${(this.discount*this.price / 10000.0).toFixed(2)} off!`,
            success: 'Sounds great!'
          }
        }
        return this.Modal.success(scope);
      }else{
        return this.$q.resolve();
      }
    })
    .then(_=>{
      this.s3.sendFile(this.$file).then((resp) => {
        let audio = `${resp.config.url}${resp.config.data.key}`;
        this.keen.log('audioUploaded',{date: Date.now(), email: token.email});
        this.Auth.createUser({
          token: token,
          audio: audio,
          amount: this.price
        }).then(_=>{
          this.order_confirmed = true;
          this.charging = false;
          this.quote_text = "Your order summary";
          this.keen.log('orderConfirmed',{date: Date.now(), email: token.email});
        });
      },  (error) => {
        console.log(error);
      },  (evt) => {
        this.progress = Math.min(parseInt(100.0 * evt.loaded / evt.total),95);
        console.log(this.progress);
      });
    })
  }

  openCheckout(){
    this.keen.log('openedCheckout',{date: Date.now()});
    this.handler.open({
      name: 'transcribe4me',
      description: `${Math.floor(this.seconds)} seconds of audio transcription`,
      amount: this.price
    });
  }

  $onInit() {
    let script = document.createElement('script');
    let $this = this;
    script.type = 'text/javascript';
    script.src = 'https://checkout.stripe.com/checkout.js';
    document.body.appendChild(script);
    script.onload = () => {
      this.$scope.$apply(() => {
        this.$http.get('/api/stripe')
          .then(response => {
            this.handler = StripeCheckout.configure({
              key: response.data,
              image: '/assets/images/four.png',
              locale: 'auto',
              currency: 'gbp',
              token: this.processToken.bind($this)
            });
          });
      })
    };
  }

  getDate(){
    let now = new Date(Date.now());
    let date = now.valueOf();
    if(now.getHours() > 16){
      date += day;
    }
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
    if(!$file) return;
    if($file.type.substring(0,5) !== 'audio'){
      alert("Please upload audio files for transcription :)");
      return;
    }else{
      this.$file = $file;
      this.filename = $file.name;
      this.s3.getDuration($file).then(seconds => {
        this.seconds = seconds;
        this.price = Math.floor(this.seconds * this.base / 60.0);
        this.keen.log('choseFile',{date: Date.now(), filename: this.filename, seconds: this.seconds, price: this.price});
        this.$timeout(()=>this.anchorSmoothScroll.scrollTo('quote'));
      })
    }
  }

  deleteFile(){
    this.$file = null;
    this.seconds  = null;
  }

}

export default angular.module('transcribeApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
