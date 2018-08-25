import Controller from '@ember/controller';
import { inject } from '@ember/service'

export default Controller.extend({
    toastr: inject('toast'),

    actions: {
        reply: function (modalDialog) {
            var replyMessage = this.get('replyMessage');
            var recieverId;
            var recieverUsername;

            if (this.model.messages.firstObject.senderId !== this.model.loggedUser.id) {    //pretraga kome se treba poslati poruka na osnovu poruke jer se tu nalaze podaci ko ucestvuje u razgovoru
                recieverId = this.model.messages.firstObject.senderId
                recieverUsername = this.model.messages.firstObject.senderUsername
            } else {
                recieverId = this.model.messages.firstObject.recieverId
                recieverUsername = this.model.messages.firstObject.recieverUsername
            }

            var message = this.store.createRecord('message', {
                content: replyMessage,
                recieverId: recieverId,
                recieverUsername: recieverUsername,

                senderId: this.model.loggedUser.id,
                senderUsername: this.model.loggedUser.username,

                subjectId: this.model.subject.id,
                subjectTitle: this.model.subject.title,
            });

            message.save().then(() => {
                this.toastr.success('Message sent');
                modalDialog.close();
            }, () => {
                this.toastr.error('An error occured');
            })
        }
    }
});
