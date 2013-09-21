Images = new Meteor.Collection("images");

Meteor.methods({
  upload: function(images) {
    console.info('Received ' + images.length + ' images.');
    images.forEach(function(image) {
      Images.insert({img: image});
    });
  },
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
