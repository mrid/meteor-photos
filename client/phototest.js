
Session.setDefault('urls', []);
Session.setDefault('buffers', []);

Template.uploader.thumbs = function() {
  var retval = [];
  Session.get('urls').forEach(function(url) {
    retval.push({url: url});
  });
  return retval;
};

Template.uploader.events({
  'change #select-image': function(inputEvt) {
    var files = inputEvt.srcElement.files;
    showThumbs(files);
    loadBuffers(files);
  },
  'click #btn-send': function() {
    Meteor.call('upload', Session.get('buffers'));
    Session.set('urls', []);
    Session.set('buffers', []);
  }
});

Template.dbview.events({
  'click #btn-clear': function() {
    Meteor.call('clear', function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      $('#img-gallery').html('');
    });
  },
  'click #btn-refresh': function() {
    Meteor.call('download', function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      $('#img-gallery').html('');
      result.forEach(function(buffer) {
        var blob = new Blob([buffer], {type: "image/jpeg"});
        var url = URL.createObjectURL(blob);
        $('#img-gallery').append('<img src="' + url + '">');
      });
    });
  },
});

var showThumbs = function(blobs) {
  var urls = [];
  var numImages = blobs.length;
  for (var index = 0; index < numImages; index++) {
    var urlReader = new FileReader();
    urlReader.onloadend = function(fileReaderEvt) {
      urls.push(fileReaderEvt.target.result);
      if (urls.length == numImages) {
        var newval = Session.get('urls').concat(urls);
        Session.set('urls', newval);
        $('#img-add').val('');
      }
    };
    urlReader.readAsDataURL(blobs[index]);
  }
};

var loadBuffers = function(blobs) {
  var buffers = [];
  var numImages = blobs.length;
  for (var index = 0; index < numImages; index++) {
    var bufferReader = new FileReader();
    bufferReader.onloadend = function(fileReaderEvt) {
      buffers.push(fileReaderEvt.target.result);
      if (buffers.length == numImages) {
        var newval = Session.get('buffers').concat(buffers);
        Session.set('buffers', newval);
      }        
    };
    bufferReader.readAsArrayBuffer(blobs[index]);
  }
};
