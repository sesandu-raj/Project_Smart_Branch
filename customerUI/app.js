// 1. Firebase Configuration (From your Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
  measurementId: "G-DPZ90E14PJ",
};

function selectService(serviceName) {
  localStorage.setItem("selectedService", serviceName);
  window.location.href = "../appointment/index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  if (typeof firebase === "undefined") {
    console.error(
      "Firebase is not loaded. Ensure the CDN scripts are available.",
    );
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const loginView = document.getElementById("login-view");
  const mainView = document.getElementById("main-view");
  const welcomeMsg = document.getElementById("welcome-msg");
  const profileInfo = document.getElementById("profile-info");
  const accountBalances = document.getElementById("account-balances");
  const appointmentStatus = document.getElementById("appointment-status");
  const branchGrid = document.getElementById("branch-grid");

  if (!loginView || !mainView || !welcomeMsg || !profileInfo || !branchGrid) {
    console.error("Missing required elements in the HTML markup.");
    return;
  }

  // Add event listener for service list
  const serviceList = document.getElementById("service-list");
  if (serviceList) {
    serviceList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        selectService(e.target.textContent.trim());
      }
    });
  }

  const showMainView = () => {
    loginView.classList.add("hidden");
    mainView.classList.remove("hidden");
  };

  const showLoginView = () => {
    loginView.classList.remove("hidden");
    mainView.classList.add("hidden");
  };

  console.log("App loaded and DOM ready.");

  const btnLogin = document.getElementById("btn-login");
  const btnDemo = document.getElementById("btn-demo");

  if (!btnLogin) {
    console.error("Missing #btn-login button.");
    return;
  }

  btnLogin.addEventListener("click", async () => {
    const userId = document.getElementById("login-id").value;
    const password = document.getElementById("login-pass").value;

    try {
      const querySnapshot = await db
        .collection("Users")
        .where("User_ID", "==", userId)
        .where("Password", "==", password)
        .get();

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("userID", userData.User_ID);
        showMainView();
        welcomeMsg.innerText = `Welcome, ${userData.Name}`;
        await loadProfileData(userId, userData);
        await loadBranches();
      } else {
        alert("Invalid credentials. Use details provided by the bank.");
      }
    } catch (error) {
      console.error("Database Error:", error);
      alert("Unable to connect to database. Check console for details.");
    }
  });

  if (btnDemo) {
    btnDemo.addEventListener("click", async () => {
      showMainView();
      welcomeMsg.innerText = "Welcome, Demo User";
      profileInfo.innerHTML = `
            <p><strong>Name:</strong> Demo User</p>
            <p><strong>NIC:</strong> 000000000V</p>
            <p><strong>Birthday:</strong> 1990-01-01</p>
        `;
      accountBalances.innerHTML = `
            <p>Current: <strong>LKR 0.00</strong></p>
            <p>Saving: <strong>LKR 0.00</strong></p>
        `;
      appointmentStatus.innerHTML = `<p>No appointments available for demo.</p>`;
      await loadBranches();
    });
  }

  async function loadBranches() {
    branchGrid.innerHTML = "";

    try {
      const querySnapshot = await db.collection("Branches").get();
      if (querySnapshot.empty) {
        branchGrid.innerHTML = `<p>No branches available.</p>`;
        return;
      }

      querySnapshot.forEach((doc) => {
        const branch = doc.data();
        const tile = document.createElement("div");
        tile.className = "branch-tile";
        tile.innerHTML = `
                <h3>${branch.branch_Name}</h3>
                <p>Code: ${branch.branch_Code}</p>
            `;
        tile.onclick = () =>
          alert(`Navigating to ${branch.branch_Name} details...`);
        branchGrid.appendChild(tile);
      });
    } catch (error) {
      console.error("Branch load error:", error);
      branchGrid.innerHTML = `<p>Unable to load branches.</p>`;
    }
  }

  async function loadProfileData(userId, userData) {
    try {
      profileInfo.innerHTML = `
            <p><strong>Name:</strong> ${userData.Name}</p>
            <p><strong>NIC:</strong> ${userData.NIC}</p>
            <p><strong>Birthday:</strong> ${userData.Birthday}</p>
        `;

      const accountSnap = await db
        .collection("Accounts")
        .where("User_ID", "==", userId)
        .get();
      accountBalances.innerHTML = "";
      accountSnap.forEach((doc) => {
        const acc = doc.data();
        accountBalances.innerHTML += `<p>${acc.account_type}: <strong>LKR ${acc.Amount}</strong></p>`;
      });

      const apptSnap = await db
        .collection("Appointments")
        .where("User_ID", "==", userId)
        .get();
      appointmentStatus.innerHTML = "";
      apptSnap.forEach((doc) => {
        const appt = doc.data();
        appointmentStatus.innerHTML += `
                <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px;">
                    <p>Status: ${appt.Status}</p>
                    <p>Time: ${appt.Time_Slot} | Branch: ${appt.Branch_Code}</p>
                </div>`;
      });
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }
});
