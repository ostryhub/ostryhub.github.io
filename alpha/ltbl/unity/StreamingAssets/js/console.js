let prepareArgs = function(args, ommitN)
{
    ommitN = ommitN || 0;
    var text = "";
    // Logger.Log("logger arguments are: "+JSON.stringify(arguments, censor(arguments), 2))

    let index = -1;
    for (const property in args)
    {
        index++;
        
        if (index < ommitN) continue;
        
        let arg = args[property]

        let json = "";
        try
        {
            if (arg === window)
            {
                json = "[window]"
            }
            else if (typeof arg === "string")
            {
                json = arg;
            }
            else
            {
                json = JSON.stringify(arg, null, 2);
            }
        }
        catch (e)
        {
            json = "[error: "+e.toString()+"]";
        }

        text += ' '+json;
    }
    
    return text
}

let loggerLog = function()
{
    let text = prepareArgs(arguments);
    Logger.Log(text);
};

let loggerLogWarning = function()
{
    let text = prepareArgs(arguments);
    Logger.LogWarning(text);
};

let loggerLogError = function()
{
    let text = prepareArgs(arguments);
    Logger.LogError(text);
};


var console = {
    log: loggerLog,
    warn: loggerLogWarning,
    error: loggerLogError
}

Logger.Log("this is "+this)
Logger.Log("console is "+console)
Logger.Log("console.log is "+console.log)

console.log("loggin works ...")
//
// var test = {
//     a: "a string",
//     b: 123,
//     c: true,
//     d: null,
//     e: test
// }
//
// let json = JSON.stringify(test)
// console.log("#### json test is: "+json)
// console.log("#### test is: ", test)