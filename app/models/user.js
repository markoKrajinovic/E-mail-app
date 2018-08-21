import DS from 'ember-data';

export default DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    username: DS.attr('string'),
    password: DS.attr('string')
    //sentMessages: DS.hasMany('message', {inverse: 'sender'}),
    //recievedMessages: DS.hasMany('message', {inverse: 'reciever'})
});
