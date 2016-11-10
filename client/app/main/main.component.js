import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

let day = 1000*60*60*24;

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $state,$q,$scope, $timeout, $window, $location,socket, s3, keen, Auth, User, Modal, anchorSmoothScroll) {
    this.$q = $q;
    this.$state = $state;
    this.$window = $window;
    this.$location = $location;
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
    this.local = this.$location.absUrl().indexOf('localhost') > -1;
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

  conversion(){
    this.$window.google_trackConversion({
      google_conversion_id: 926881873,
      google_conversion_language: "en",
      google_conversion_format: "3",
      google_conversion_color: "ffffff",
      google_conversion_label: "wqKcCI3N72sQ0bD8uQM",
      google_conversion_value: 5.00,
      google_conversion_currency: "GBP",
      google_remarketing_only: false
    });
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
          amount: this.price,
          discount: this.discount
        }).then(_ => {
          this.order_confirmed = true;
          this.charging = false;
          this.quote_text = "Your order summary";
          if(!this.local) this.conversion();
          this.keen.log('orderConfirmed',{date: Date.now(), email: token.email});
          this.Auth.getCurrentUser((user)=>{
            this.$state.go('thankyou',{user_id: user._id});
          })
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
              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNi0xMS0wMVQwOToxMTo5NzwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjUuMTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yNTY8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFj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',
              locale: 'auto',
              currency: 'gbp',
              token: this.processToken.bind($this)
            });
          });
      })
    };
    if(!this.local){
      console.log("inspectletjs");
      let script2 = document.createElement('script');
      script2.id = 'inspectletjs';
      script2.innerHTML = `window.__insp = window.__insp || [];
        __insp.push(['wid', 632623227]);
        (function() {
        function ldinsp(){if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
        setTimeout(ldinsp, 500); document.readyState != "complete" ? (window.attachEvent ? window.attachEvent('onload', ldinsp) : window.addEventListener('load', ldinsp, false)) : ldinsp();
        })();`
      document.body.appendChild(script2);
      script2.onload = () => {
        this.$scope.$apply(() => {
          console.log("Great");
        })
      };

      let script3 = document.createElement('script');
      script3.innerHTML = `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-58967554-3', 'auto');
      ga('send', 'pageview');`
      document.body.appendChild(script3);
      script3.onload = () => {
        this.$scope.$apply(() => {
          console.log("Great2");
        })
      };
    }
  }

  getDate(){
    let now = new Date(Date.now());
    let date = now.valueOf();
    this.date = new Date(date + day);
  }

  chooseFile($file){
    console.log($file);
    if(!$file) return;
    if($file.type.substring(0,5) !== 'audio'){
      alert("Please upload audio files for transcription :)");
      return;
    }else{
      this.s3.getDuration($file).then(seconds => {
        this.getDate();
        this.$file = $file;
        this.filename = $file.name;
        this.seconds = seconds;
        this.price = Math.floor(this.seconds * this.base / 60.0);
        this.keen.log('choseFile',{date: Date.now(), filename: this.filename, seconds: this.seconds, price: this.price});
        this.$timeout(()=>this.anchorSmoothScroll.scrollTo('quote'));
      }).catch(err => {
        let scope = {
          modal: {
            title: `We dont support the ${$file.type.substring(6).toUpperCase()} audio extension!`,
            text: 'Sorry about this, could you please convert the file to mp3 before uploading?'
          }
        }
        this.Modal.danger(scope);
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
