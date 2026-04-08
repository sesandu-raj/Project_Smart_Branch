// Firebase config (same as your other pages)
const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
  measurementId: "G-DPZ90E14PJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("btn-register").addEventListener("click", async () => {
  const branchData = {
    branch_Name: document.getElementById("branch-name").value,
    branch_Code: document.getElementById("branch-code").value.trim(),
    branch_Email: document.getElementById("branch-email").value,
  };

  // Validation
  if (
    !branchData.branch_Name ||
    !branchData.branch_Code ||
    !branchData.branch_Email
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await db.collection("Branches").add(branchData);

    alert("Branch Registered Successfully!");

    window.location.href = "../customerUI/index.html";
  } catch (error) {
    console.error("Error adding branch: ", error);
    alert("Error: " + error.message);
  }
});
