Build
---
    npm install -g meteorite
    mrt install
    meteor

Outside Fixes for Safari
---
`collectionFS_client.api.js` in `unionChunkBlobs`:

    var buffers = fileItem.queueChunks.map(function(f) { return f.buffer; } );
    self.queue[fileId].blob = new Blob(buffers, { type: fileItem.contentType });

`canvas-toBlob.js` add `.buffer` on a couple lines near the end:

    blob = new Blob([decode_base64(data).buffer], {type: type});
	blob = new Blob([decodeURIComponent(data).buffer], {type: type});

Libraries
---
- [CollectionFS](http://raix.github.io/Meteor-CollectionFS/)
- [Client-side resize](https://github.com/stomita/ios-imagefile-megapixel)
- [exif parser](https://github.com/jseidelin/exif-js) for orientation

Notes
---
- http://stackoverflow.com/questions/15514234/process-incoming-xhr2-data-blob
- http://blueimp.github.io/jQuery-File-Upload/
