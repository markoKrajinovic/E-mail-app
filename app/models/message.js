import DS from 'ember-data';

export default DS.Model.extend({
    content: DS.attr('string'),
    createdAt: DS.attr('date', {
        defaultValue() { return new Date(); }
    }),

    recieverId: DS.attr('string'),
    recieverUsername: DS.attr('string'),

    senderId: DS.attr('string'),
    senderUsername: DS.attr('string'),
    
    subjectId: DS.attr('string'),
    subjectTitle: DS.attr('string'),
    /*
    reciever: DS.belongsTo('user'),
    sender: DS.belongsTo('user'),
    subject: DS.belongsTo('subject')*/
});
