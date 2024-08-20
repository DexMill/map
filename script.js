import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeVhK13h6Zqyjk5g5oJrelGTyzHqe1fqk",
  authDomain: "maps-fd2ca.firebaseapp.com",
  databaseURL: "https://maps-fd2ca-default-rtdb.firebaseio.com",
  projectId: "maps-fd2ca",
  storageBucket: "maps-fd2ca.appspot.com",
  messagingSenderId: "714979249784",
  appId: "1:714979249784:web:baaee51c6797d9b5f9a78d",
  measurementId: "G-VBES8BHK1B",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map;

function initMap() {
  if (!map) {
    map = L.map("map").setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
}

function addEvent(name, description, lat, lng) {
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>${description}`);

  push(ref(database, "events"), {
    name: name,
    description: description,
    lat: lat,
    lng: lng,
  });
}

function setupEventListeners() {
  document
    .getElementById("event-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("event-name").value;
      const description = document.getElementById("event-description").value;
      const center = map.getCenter();
      addEvent(name, description, center.lat, center.lng);
      this.reset();
    });

  map.on("click", function (e) {
    const name = prompt("Enter event name:");
    if (name) {
      const description = prompt("Enter event description:");
      addEvent(name, description, e.latlng.lat, e.latlng.lng);
    }
  });
}

function loadExistingEvents() {
  onChildAdded(ref(database, "events"), function (snapshot) {
    const event = snapshot.val();
    const marker = L.marker([event.lat, event.lng]).addTo(map);
    marker.bindPopup(`<b>${event.name}</b><br>${event.description}`);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initMap();
  setupEventListeners();
  loadExistingEvents();
});
