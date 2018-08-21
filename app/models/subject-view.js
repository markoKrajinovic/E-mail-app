import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    date: DS.attr('string'),
    sender: DS.attr('string'),
    lastMessage: DS.attr('string'),
    lastMessageDate: DS.attr('date')
});
