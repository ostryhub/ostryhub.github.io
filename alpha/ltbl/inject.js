console.log("src/inject.js: Injecting deps into embedded frame window frames[0] is ",frames[0])
console.log("just injected webpackNumbers into iframe, frames[0].window", frames[0].window)
console.log("Injecting embedded frame window")

frames[0].window.webpackNumbers = window.webpackNumbers;
frames[0].window.webpackNumbers.init(frames[0].window);


