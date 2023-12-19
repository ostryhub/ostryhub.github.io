var XMLHttpRequest_idCounter = 0;

class XMLHttpRequest {

    _log(msg) {
        // return;
        msg = msg + " "+prepareArgs(arguments, 1);
        console.log("XHR "+this._id+" "+msg)
    }

    _logError(error) {
        error = error + " "+prepareArgs(arguments, 1);
        console.error("XHR "+this._id+" "+error)
        return;
    }
    
    constructor() {
        this._id = XMLHttpRequest_idCounter++;
        
        this._onload = () => {
            this._log('XMLHttpRequest default onload called. id: ');
        };

        this._method = null;
        this._url = null;
        this.async = null;
        this._response = null;

        this._log('XMLHttpRequest created.')
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
        this._log('responseType: ',type)
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
        this._method = method;
        this._url = url;
        this.async = async;
        
        this._log("open: ",method, `'${url.substring(0,40)}'`, async)
    }

    send(body) {
        try {
            this._log("send: ", body)
    
            let url = this._url;
            
            var buffer = null; // a bytes array
            
            // if (url.startsWith("wasm/"))
            // {
            //     this._log("loading wasm/")
            //     buffer = WASMLoader.Load();
            // }

            if (url.endsWith(".wasm"))
            {
                if (url.startsWith("/")) url = url.substring(1);
                this._log("loading *.wasm file")
                buffer = WASMLoader.Load(url);
            }
    
            this._log("Buffer: ", Buffer)
            this._log("Typeof Buffer: ", typeof(Buffer))
            
            if (url.startsWith("data:"))
            {
                this._log("loading data:")
                const base64String = url.split(',')[1]; // Split the URI and take the data part
                this._log("base64String:", base64String.substring(0,40))

                // Buffer type is exposed from fonts.js in webpack-numbers module, its installed via npm there via npm from "buffer": "^6.0.3",
                const buf = Buffer.from(base64String, 'base64'); // Create a buffer from the base64 string
                this._log("buf:", buf)

                const arrayBuffer = new Uint8Array(buf).buffer;
                this._log("arrayBuffer:", arrayBuffer)

                buffer = arrayBuffer;
            }
            
            this._log("buffer: ", (typeof buffer))
            this._log("buffer.length: ", buffer.length)
        
            this.response = buffer;
        
            this._log("calling onload() callback")
            this._onload();
        }
        catch(error)
        {
            this._logError("send() error: ",error.toString())
        }
    }
    
    overrideMimeType(mimeType){
        console.log("mimeType: ", mimeType)
    }
}
