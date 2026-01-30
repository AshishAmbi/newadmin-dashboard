// ---------------- FIREBASE CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDB5nVKuVEu48egVWK8zPXtzi4VqLJwSx8",
  authDomain: "smart-garage-4cb18.firebaseapp.com",
  projectId: "smart-garage-4cb18",
  storageBucket: "smart-garage-4cb18.appspot.com",
  messagingSenderId: "630399871832",
  appId: "1:630399871832:web:d2d9b2522923ed3411d32d"
};

// Initialize Firebase (ONLY ONCE)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "ambiashish87@gmail.com";

// ---------------- LOGIN ----------------
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const status = document.getElementById("loginStatus");

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      window.location.href = "admin-dashboard.html";
    })
    .catch(err => {
      status.innerText = err.message;
    });
}

// ---------------- LOGOUT ----------------
function logout() {
  auth.signOut().then(() => {
    window.location.href = "admin-login.html";
  });
}

// ---------------- AUTH + ADMIN CHECK ----------------
auth.onAuthStateChanged(user => {

  // If not logged in and on dashboard → redirect
  if (!user && window.location.pathname.includes("dashboard")) {
    window.location.href = "admin-login.html";
    return;
  }

  // If logged in but NOT admin → block access
  if (user && user.email !== ADMIN_EMAIL) {
    alert("Access denied");
    auth.signOut();
    return;
  }

  // Admin authenticated → load data
  if (user && document.getElementById("bookingsList")) {
    console.log("Admin logged in:", user.email);
    loadBookings();
    loadContacts();
  }
});

// ---------------- LOAD BOOKINGS ----------------
function loadBookings() {
  const box = document.getElementById("bookingsList");
  box.innerHTML = "";

  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      snapshot => {
        box.innerHTML = "";
        snapshot.forEach(doc => {
          const d = doc.data();
          box.innerHTML += `
            <div class="item">
              <b>${d.name}</b><br>
              ${d.vehicle} | ${d.service}<br>
              ₹${d.cost}
            </div>
          `;
        });
      },
      error => {
        console.error("Bookings error:", error);
        alert("Permission denied for bookings");
      }
    );
}

// ---------------- LOAD CONTACT MESSAGES ----------------
function loadContacts() {
  const box = document.getElementById("contactsList");
  box.innerHTML = "";

  db.collection("contactMessages")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      snapshot => {
        box.innerHTML = "";
        snapshot.forEach(doc => {
          const d = doc.data();
          box.innerHTML += `
            <div class="item">
              <b>${d.name}</b><br>
              ${d.email}<br>
              ${d.message}
            </div>
          `;
        });
      },
      error => {
        console.error("Contacts error:", error);
        alert("Permission denied for messages");
      }
    );
}
