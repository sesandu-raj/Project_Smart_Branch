// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
  measurementId: "G-DPZ90E14PJ",
};

// Global function for service selection
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

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // DOM Elements
  const loginView = document.getElementById("login-view");
  const mainView = document.getElementById("main-view");
  const welcomeMsg = document.getElementById("welcome-msg");
  const profileInfo = document.getElementById("profile-info");
  const accountBalances = document.getElementById("account-balances");
  const appointmentStatus = document.getElementById("appointment-status");
  const branchGrid = document.getElementById("branch-grid");
  const btnLogin = document.getElementById("btn-login");
  const btnDemo = document.getElementById("btn-demo");

  // View Toggle Functions
  const showMainView = () => {
    loginView.classList.add("hidden");
    mainView.classList.remove("hidden");
  };

  const showLoginView = () => {
    loginView.classList.remove("hidden");
    mainView.classList.add("hidden");
  };

  // Login Logic
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const userId = document.getElementById("login-id").value;
      const password = document.getElementById("login-pass").value;

      if (!userId || !password) {
        alert("Please enter both User ID and Password.");
        return;
      }

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
          // Applying the new design's welcome style
          welcomeMsg.innerHTML = `Welcome back, <br/><span class="text-emerald-600">${userData.Name}</span>`;

          await loadProfileData(userId, userData);
          await loadBranches();
        } else {
          alert("Invalid credentials. Use details provided by the bank.");
        }
      } catch (error) {
        console.error("Database Error:", error);
        alert("Unable to connect to database.");
      }
    });
  }

  // Demo Mode Logic
  if (btnDemo) {
    btnDemo.addEventListener("click", async () => {
      showMainView();
      welcomeMsg.innerHTML = `Welcome back, <br/><span class="text-emerald-600">Demo User</span>`;

      profileInfo.innerHTML = `
        <div class="space-y-1">
          <p><strong>Name:</strong> Demo User</p>
          <p><strong>NIC:</strong> 000000000V</p>
          <p><strong>Birthday:</strong> 1990-01-01</p>
        </div>
      `;
      accountBalances.innerHTML = `
        <div class="flex justify-between items-center border-b border-white/10 pb-2">
          <span class="text-sm opacity-80">Current Account</span>
          <span class="font-bold">LKR 0.00</span>
        </div>
        <div class="flex justify-between items-center border-b border-white/10 pb-2">
          <span class="text-sm opacity-80">Savings Account</span>
          <span class="font-bold">LKR 0.00</span>
        </div>
      `;
      appointmentStatus.innerHTML = `<p class="text-slate-500 italic">No appointments available for demo.</p>`;
      await loadBranches();
    });
  }

  // Load Branches into the Bento Grid Design
  async function loadBranches() {
    if (!branchGrid) return;
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
        // Using the new Sovereign design classes
        tile.className =
          "bg-white p-6 rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all cursor-pointer shadow-sm group";
        tile.innerHTML = `
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-headline font-bold text-lg group-hover:text-emerald-600 transition-colors">${branch.branch_Name}</h3>
              <p class="text-slate-500 text-sm">Branch Code: ${branch.branch_Code}</p>
            </div>
            <span class="material-symbols-outlined text-slate-300 group-hover:text-emerald-500 transition-colors">location_on</span>
          </div>
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

  // Load Profile and Financial Data
  async function loadProfileData(userId, userData) {
    try {
      // Update Personal Info Panel
      profileInfo.innerHTML = `
        <div class="space-y-2">
          <p class="flex justify-between"><span class="text-slate-400">Full Name:</span> <span class="font-semibold">${userData.Name}</span></p>
          <p class="flex justify-between"><span class="text-slate-400">NIC/ID:</span> <span class="font-semibold">${userData.NIC}</span></p>
          <p class="flex justify-between"><span class="text-slate-400">Birthday:</span> <span class="font-semibold">${userData.Birthday}</span></p>
        </div>
      `;

      // Update Account Balances Panel (Black Card)
      const accountSnap = await db
        .collection("Accounts")
        .where("User_ID", "==", userId)
        .get();

      accountBalances.innerHTML = "";
      if (accountSnap.empty) {
        accountBalances.innerHTML =
          "<p class='text-sm opacity-60'>No active accounts found.</p>";
      }

      accountSnap.forEach((doc) => {
        const acc = doc.data();
        accountBalances.innerHTML += `
          <div class="flex justify-between items-center border-b border-white/10 pb-2 mb-2 last:border-0">
            <span class="text-sm opacity-80">${acc.account_type}</span>
            <span class="font-bold">LKR ${parseFloat(acc.Amount).toLocaleString()}</span>
          </div>`;
      });

      // Update Appointment Status Panel
      const apptSnap = await db
        .collection("Appointments")
        .where("User_ID", "==", userId)
        .get();

      appointmentStatus.innerHTML = "";
      if (apptSnap.empty) {
        appointmentStatus.innerHTML =
          "<p class='text-slate-500'>No scheduled appointments.</p>";
      }

      apptSnap.forEach((doc) => {
        const appt = doc.data();
        const statusColor =
          appt.Status === "Accepted" ? "text-emerald-600" : "text-amber-600";
        appointmentStatus.innerHTML += `
          <div class="bg-white p-4 rounded-xl border border-slate-200 mb-3 shadow-sm">
            <div class="flex justify-between items-center mb-2">
               <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Status</span>
               <span class="text-sm font-bold ${statusColor}">${appt.Status}</span>
            </div>
            <p class="font-headline font-bold text-slate-900">${appt.Time_Slot}</p>
            <p class="text-xs text-slate-500">Branch: ${appt.Branch_Code}</p>
          </div>`;
      });
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }
});
