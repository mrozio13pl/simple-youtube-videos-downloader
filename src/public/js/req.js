function parse(url) {
    
    var videoId = /^https?\:\/\/(www\.)?youtu\.be/.test(url) ? url.replace(/^https?\:\/\/(www\.)?youtu\.be\/([\w-]{11}).*/,"$2") : url.replace(/.*\?v\=([\w-]{11}).*/,"$1");
    
    return {
      id: videoId
    };
    
  };
document.getElementById('download').onclick = () => {
    if(!isNaN(document.querySelector('select').value)){
    window.open(`http://localhost/video?url=${parse(document.querySelector('#ytlink').value).id}&q=${document.querySelector('select').value}`)
    }else{
        window.open(`http://localhost/audio?url=${parse(document.querySelector('#ytlink').value).id}&q=${document.querySelector('select').value}`)
    }
}