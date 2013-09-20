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
    console.info('todo');
    Session.set('urls', []);
    Session.set('buffers', []);
  }
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
