Session.setDefault('urls', []);
Session.setDefault('buffers', []);

Template.uploader.images = function() {
  var retval = [];
  Session.get('urls').forEach(function(url) {
    retval.push({url: url});
  });
  return retval;
};

Template.uploader.events({

  'change #img-add': function(inputEvt) {

    var urls = [];
    var buffers = [];
    var files = inputEvt.srcElement.files;
    var numImages = files.length;
    for (var i = 0; i < numImages; i++) {
      var file = files[i];

      var urlReader = new FileReader();
      urlReader.onloadend = function(fileReaderEvt) {
        urls.push(fileReaderEvt.target.result);
        if (urls.length == numImages) {
          var newval = Session.get('urls').concat(urls);
          Session.set('urls', newval);
          $('#img-add').val('');
        }
      };
      urlReader.readAsDataURL(file);

      var bufferReader = new FileReader();
      bufferReader.onloadend = function(fileReaderEvt) {
        buffers.push(fileReaderEvt.target.result);
        if (buffers.length == numImages) {
          var newval = Session.get('buffers').concat(buffers);
          Session.set('buffers', newval);
        }        
      };
      bufferReader.readAsArrayBuffer(file);
    }
  }
});
