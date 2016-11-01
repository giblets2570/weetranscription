/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import UserEvents from './user.events';

import sendgridApi from 'sendgrid';
var sendgrid = sendgridApi("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");

// Model events to emit
var event = 'save';

export function hooks() {
  UserEvents.on(event, function(user){
    if(user.role==='customer'){
      if(user.text){

      }else{
        var emailCustomer = new sendgrid.Email();
        emailCustomer.addTo(user.email);
        emailCustomer.setFrom('admin@transcribe4.me');
        var html = `
        <h3> 
          Your order has arrived.
        </h3>
        <p>
          We are now putting everything in place so your transcription will arrive shortly.</p>
        </p>
        <p>
          To view your audio file, click <a target="_blank" href="${user.audio}">here</a>. 
          We will email you your transcription when it is ready.
        </p>
        <p>
          Have a great day,<br>
          The Transcribe4me Team
        </p>
        `
        emailCustomer.setHtml(html);
        emailCustomer.setSubject("Thanks for using Transcribe4me");
        sendgrid.send(emailCustomer, function(err, json) {
          if(err){
            console.log(err);
          }else{
            console.log(json);
          }
        });
      }
    }
  });
}