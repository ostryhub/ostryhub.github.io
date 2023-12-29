console.log("src/inject.js: Injecting deps into embedded frame window frames[0] is ",frames[0])

// (() => {
    console.log("just injected webpackNumbers into iframe, frames[0].window", frames[0].window)
    
    frames[0].window.geometry = window.geometry;
    frames[0].window.geometry.init(frames[0].window);
// })();

// (() => {
//     console.log("Injecting firebaseProvider: ",firebaseProvider)

    console.log("Injecting firebaseConfig: ",firebaseConfig)
    console.log("Injecting firebase: ",firebase)

    frames[0].window.firebaseConfig = firebaseConfig;
    frames[0].window.firebase = firebase;

    // const p = firebaseProvider;
    // frames[0].window.firebaseConfig = p.firebaseConfig;
    //
    // const { initializeApp } = p.initializeApp;
    // // const { getAnalytics } = p.getAnalytics;
    // // const { getAuthentication } = p.getAuthentication;
    // // const { getStorage } = p.getStorage;
    // // const { getFirestore } = p.getFirestore;
    //
    // // Initialize Firebase
    // const app = initializeApp(p.firebaseConfig);
    // frames[0].window.firebase = app;
    // // frames[0].window.analytics = getAnalytics(app);
    // // frames[0].window.authentication = getAuthentication(app);
    // // frames[0].window.storage = getStorage(app);
    // // frames[0].window.firestore = getFirestore(app);
    
// })();

