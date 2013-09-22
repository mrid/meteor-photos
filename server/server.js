Images = new Meteor.Collection("images");

Meteor.methods({
  clear: function() {
    Images.remove({});
  },
  download: function() {
    var docs = Images.find().fetch();
    var buffers = _.pluck(docs, 'img');
    console.info(buffers);
    return buffers;
  }
});

Meteor.Router.add('/upload/:id', 'POST', function(id) { 

  console.info('Uploading ', id, this.request.body);

  Images.insert({id: id, date: Date.now()});

  var fs = Npm.require('fs');
  // fs.writeSync(

});
