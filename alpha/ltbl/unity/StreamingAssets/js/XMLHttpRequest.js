
// XMLHttpRequest.prototype.open

class XMLHttpRequest {

    constructor() {
        this._onload = () => {
            console.log('XMLHttpRequest default onload called.')
        };
        
        this._response = null;
    }
    
    get readyState() {
        return 200;
    }
    
    get response() {
        return this._response;
    }
    
    set response(value) {
        this._response = value; 
    }
    
    get responseText() {
        return "string"
    }
    
    get responseType() {
        return "arraybuffer"
    }
    
    set responseType(type) {
        console.log('responseType: ',type)
    }
    
    get responseURL() {
    }
    
    get status() {
        return 200;
    }
    
    get statusText() {
    }
    
    set timeout(value) {
    }

    set onload(func) {
        this._onload = func;
    }
    
    open(method, url, async) {
        console.log("open: ",method, url, async)
    }

    send(body) {
        console.log("send: ", body)

        var buffer = WASMLoader.Load();
        console.log("buffer: ", (typeof buffer))
        console.log("buffer.length: ", buffer.length)
        this.response = buffer;
        this._onload();
    }
    
    overrideMimeType(mimeType){
        console.log("mimeType: ", mimeType)
    }
}
