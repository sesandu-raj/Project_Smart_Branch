// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. The Intelligence Map (Updated with Corporate & Business Requirements)
const serviceDocsMap = {
  "Savings Account Opening": [
    "Valid NIC / Passport",
    "Proof of Address (Utility Bill)",
    "Passport-size Photographs",
    "Initial Deposit Amount",
  ],
  "Fixed Deposit": [
    "NIC / Passport",
    "Existing Savings Account Details",
    "Deposit Amount",
    "FD Application Form",
  ],
  "Personal Loan": [
    "NIC / Passport",
    "Proof of Address",
    "Salary Slips (Last 3-6 months)",
    "Bank Statements (Last 6 months)",
    "Employment Confirmation Letter",
  ],
  "Housing Loan": [
    "NIC / Passport",
    "Proof of Income Records",
    "Property Deed / Title Certificate",
    "Approved Building Plan",
    "Valuation Report",
  ],
  "Pawning (Gold Loan)": [
    "NIC / Passport",
    "Physical Gold Items",
    "Pawning Application Form",
  ],
  "Business Current Account": [
    "Certificate of Incorporation",
    "Business Registration Certificate",
    "Articles of Association",
    "Board Resolution",
    "NIC copies of directors",
    "Proof of business address",
  ],
  "Corporate Loans": [
    "Business registration documents",
    "Financial statements (audited)",
    "Bank statements (last 6–12 months)",
    "Cash flow statements",
    "Tax documents (TIN/VAT)",
  ],
  "Trade Finance": [
    "Business registration",
    "Import/export license",
    "Proforma invoice",
    "Purchase contracts",
    "Financial statements",
    "Board resolution",
  ],
  "Payroll Management": [
    "Business registration",
    "Employee list with NIC details",
    "Salary structure",
    "Company bank account details",
  ],
  "Foreign Exchange": [
    "Business registration",
    "Import/export documents",
    "Invoices",
    "Customs documents",
    "Bank account details",
  ],
  "Merchant Services": [
    "Business registration certificate",
    "Bank account details",
    "Tax registration",
    "Details of business operations",
    "Website details (for online payments)",
  ],
  "Asset Financing": [
    "Business registration",
    "Financial statements",
    "Quotation for asset (vehicle/machine)",
    "Bank statements",
    "Tax documents",
  ],
};

// 3. Load Selected Service and Render Documents
const selectedService = localStorage.getItem("selectedService");

function renderDynamicDocuments() {
  const displayService = document.getElementById("display-service");
  const docContainer = document.getElementById("document-options");

  if (selectedService) {
    displayService.innerText = selectedService;

    // Find the documents for the selected service
    const docs = serviceDocsMap[selectedService] || ["Valid NIC / Passport"]; // Default if not found

    // Clear the static checkboxes and inject dynamic ones
    docContainer.innerHTML = "";

    docs.forEach((doc) => {
      const label = document.createElement("label");
      label.className =
        "flex items-center gap-4 p-4 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors border border-transparent hover:border-on-tertiary-container";
      label.innerHTML = `
        <input type="checkbox" value="${doc}" class="doc-checkbox w-5 h-5 rounded text-on-tertiary-container focus:ring-on-tertiary-container" />
        <span class="font-medium text-slate-700">${doc}</span>
      `;
      docContainer.appendChild(label);
    });
  } else {
    displayService.innerText = "No service selected";
    docContainer.innerHTML =
      "<p class='p-4 text-secondary italic'>Please go back and select a service.</p>";
  }
}

// 4. Populate Branches from Firestore
async function loadBranches() {
  const branchSelect = document.getElementById("branch-select");
  try {
    const snapshot = await db.collection("Branches").get();
    snapshot.forEach((doc) => {
      const branch = doc.data();
      const option = document.createElement("option");
      option.value = branch.branch_Code;
      option.textContent = `${branch.branch_Code} - ${branch.branch_Name}`; // Shows "163 - Mayfair, London"
      branchSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading branches:", error);
  }
}

// 5. Handle Appointment Booking
let selectedDay = null;
let selectedTimeSlot = null;

// Bank working hours: 8:00 AM to 2:52 PM
const BANK_START_HOUR = 8;
const BANK_END_HOUR = 14; // 2 PM (slots go 14:00-15:00)

function setupBookingHandler() {
  const daySelector = document.getElementById("day-selector");
  const timeSlotsContainer = document.getElementById("time-slots-container");
  const timeSlotsGrid = document.getElementById("time-slots-grid");
  const bookBtn = document.getElementById("btn-book");

  // Day button handlers
  if (daySelector) {
    daySelector.querySelectorAll(".day-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Deselect other days
        daySelector
          .querySelectorAll(".day-btn")
          .forEach((b) =>
            b.classList.remove(
              "bg-emerald-600",
              "text-white",
              "border-emerald-600",
            ),
          );

        // Select clicked day
        btn.classList.add("bg-emerald-600", "text-white", "border-emerald-600");
        selectedDay = parseInt(btn.dataset.day); // 1=Monday, 5=Friday
        selectedTimeSlot = null; // Reset time slot

        // Generate and show time slots
        generateTimeSlots(timeSlotsGrid);
        timeSlotsContainer.classList.remove("hidden");
      });
    });
  }

  // Booking button handler
  if (bookBtn) {
    bookBtn.addEventListener("click", async () => {
      const userId = localStorage.getItem("userID");
      const branchCode = document.getElementById("branch-select").value;

      const checkboxes = document.querySelectorAll(".doc-checkbox:checked");
      const documentList = Array.from(checkboxes)
        .map((cb) => cb.value)
        .join(", ");

      // Validations
      if (!selectedService) return alert("Please select a service.");
      if (!branchCode) return alert("Please select a branch.");
      if (checkboxes.length === 0)
        return alert(
          "Please confirm you have the required documents by checking the boxes.",
        );
      if (!selectedDay) return alert("Please select a working day.");
      if (!selectedTimeSlot) return alert("Please select a time slot.");

      // Calculate the date for the selected day (next occurrence of that weekday)
      const appointmentDate = getNextWeekdayDate(selectedDay);
      const fullTimeValue = `${appointmentDate}T${selectedTimeSlot}:00`; // e.g., "2026-04-10T09:00:00"

      const appointmentData = {
        Branch_Code: branchCode,
        Documents: documentList,
        Service_Type: selectedService,
        Status: "Submitted",
        Time_Slot: fullTimeValue,
        User_ID: userId || "Guest_User",
        Created_At: firebase.firestore.FieldValue.serverTimestamp(),
      };

      try {
        await db.collection("Appointments").add(appointmentData);
        alert(
          "Success! Your private session is scheduled for " +
            appointmentDate +
            " at " +
            selectedTimeSlot,
        );
        window.location.href = "../customerUI/profile.html";
      } catch (error) {
        console.error("Booking Error:", error);
        alert("Error: " + error.message);
      }
    });
  }
}

// Get next occurrence of a weekday (1=Monday, 5=Friday)
function getNextWeekdayDate(dayOfWeek) {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Calculate days to add
  let daysToAdd = dayOfWeek - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7; // If day has passed, get next week

  const appointmentDate = new Date(today);
  appointmentDate.setDate(appointmentDate.getDate() + daysToAdd);

  // Format as YYYY-MM-DD
  return appointmentDate.toISOString().split("T")[0];
}

// Generate hourly time slots for bank hours
function generateTimeSlots(timeSlotsGrid) {
  timeSlotsGrid.innerHTML = ""; // Clear old slots

  const slots = [];
  for (let hour = BANK_START_HOUR; hour < BANK_END_HOUR; hour++) {
    const startTime = String(hour).padStart(2, "0") + ":00";
    const endHour = hour + 1;
    const endTime = String(endHour).padStart(2, "0") + ":00";
    slots.push(`${startTime} - ${endTime}`);
  }

  slots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerText = slot;
    btn.className =
      "p-3 text-sm font-semibold rounded-lg border border-outline-variant hover:border-emerald-500 hover:bg-emerald-50 transition-all";

    btn.onclick = () => {
      // Deselect other slots
      document
        .querySelectorAll("#time-slots-grid button")
        .forEach((b) =>
          b.classList.remove(
            "bg-emerald-600",
            "text-white",
            "border-emerald-600",
          ),
        );

      // Select clicked slot
      btn.classList.add("bg-emerald-600", "text-white", "border-emerald-600");
      selectedTimeSlot = slot.split(" - ")[0]; // Save just the start time (e.g., "09:00")
    };

    timeSlotsGrid.appendChild(btn);
  });
}
// Run loaders on page load
window.onload = () => {
  renderDynamicDocuments();
  loadBranches();
  setupBookingHandler();
};
