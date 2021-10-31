var _db;

function initFireBase() {
  _db = firebase.firestore();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getAllAlbums();
      $("#login").css("display", "none");
      $("#logout").css("display", "block");
      console.log("signed in");
    } else {
      getSomeAlbums();
      $("#login").css("display", "block");
      $("#logout").css("display", "none");
      console.log("logged out");
    }
  });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");
    })
    .catch((error) => {
      // An error happened.
    });
}

function signInEmail() {
  let email = $("#login-email").val();
  let password = $("#login-password").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("Signed in");
      $("#login-email").val("");
      $("#login-password").val("");
      clearModal();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      clearModal();
      console.log(user + " user google");
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

function signUp() {
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      $("#fName").val("");
      $("#lName").val("");
      $("#email").val("");
      $("#pw").val("");
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("account created");
      clearModal();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log(errorMessage);
    });
}

function displayAlbums(doc) {
  $("#albums").append(`
    <div class="album">
        <h1 class="album__name">${doc.data().Name}</h1>
        <div class="album__info">
            <div class="album__info__cover" style="background-image:url(${
              doc.data().Photo
            })"></div>
            <div class="album__info__right">
                <div class="album__info__right__artist">
                  <p>Artist</p>
                  <p>${doc.data().Artist}</p>
                </div>
                <div class="album__info__right__genre">
                  <p>Genre</p> 
                  <p>${doc.data().Genre}</p>
                </div>
            </div>
        </div>
    </div>
    `);
}

function getAlbums(genre) {
  const user = firebase.auth().currentUser;

  if (genre == "all") {
    if (user) {
      console.log("all logged in");
      getAllAlbums();
    } else {
      console.log("all logged out");
      getSomeAlbums();
    }
  }
  if (genre === "Pop") {
    $("#home-title").html("Pop");
    $("#albums").html("");
    if (user) {
      console.log("pop logged in");
      genreAlbums(genre);
    } else {
      console.log("pop logged out");
      genreAlbumnsLimited(genre);
    }
  }
  if (genre == "Alternative") {
    $("#home-title").html("Alternative");
    $("#albums").html("");
    if (user) {
      genreAlbums(genre);
    } else {
      genreAlbumnsLimited(genre);
    }
  }
  if (genre == "Soundtrack") {
    $("#home-title").html("Soundtrack");
    $("#albums").html("");
    if (user) {
      genreAlbums(genre);
    } else {
      genreAlbumnsLimited(genre);
    }
  }
}

function genreAlbums(genre) {
  _db
    .collection("Albums")
    .where("Genre", "==", genre)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayAlbums(doc);
      });
    });
}

function genreAlbumnsLimited(genre) {
  _db
    .collection("Albums")
    .where("Genre", "==", genre)
    .limit(1)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayAlbums(doc);
      });
    });
}

function initListeners() {
  $(".button").click(function (e) {
    let genre = e.currentTarget.id;
    getAlbums(genre);
  });

  $("#login").click(function (e) {
    $(".modal").css("display", "flex");
  });
}

function clearModal() {
  $(".modal").css("display", "none");
}

function getAllAlbums() {
  $("#home-title").html("All Albums");
  $("#albums").html("");
  _db
    .collection("Albums")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayAlbums(doc);
      });
    });
}

function getSomeAlbums() {
  $("#home-title").html("All Albums");
  $("#albums").html("");
  _db
    .collection("Albums")
    .limit(3)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        displayAlbums(doc);
      });
    });
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFireBase();
    initListeners();
  } catch {
    console.error(e);
  }
});
