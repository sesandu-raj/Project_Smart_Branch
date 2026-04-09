const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
  measurementId: "G-DPZ90E14PJ",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("btn-register").addEventListener("click", async () => {
  // Mapping all fields (Existing + New)
  const branchData = {
    branch_Name: document.getElementById("branch-name").value,
    branch_Code: document.getElementById("branch-code").value.trim(),
    branch_Email: document.getElementById("branch-email").value,
    branch_Password: document.getElementById("branch-password").value, // NEW
    branch_Phone: document.getElementById("branch-phone").value, // NEW
    branch_Manager: document.getElementById("branch-manager").value, // NEW
    branch_Address: document.getElementById("branch-address").value, // NEW
  };

  // Validation
  if (Object.values(branchData).some((val) => !val)) {
    alert("Please fill all fields to maintain institutional integrity.");
    return;
  }

  try {
    await db.collection("Branches").add(branchData);
    alert("Branch Registered Successfully!");
    // Navigating back to Staff UI or Customer UI as per your project flow
    window.location.href = "../StaffUI/index.html";
  } catch (error) {
    console.error("Error adding branch: ", error);
    alert("Registration failed: " + error.message);
  }
});
