// ======================================================
// DAILY EXPENSES
// Main application logic
// ======================================================

const STORAGE_KEY = "dailyExpenses";

let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


// ------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------

const amountInput = document.getElementById("amount");
const paymentMethod = document.getElementById("paymentMethod");
const categorySelect = document.getElementById("category");
const vehicleContainer = document.getElementById("vehicleContainer");
const vehicleSelect = document.getElementById("vehicle");
const descriptionInput = document.getElementById("description");

const addExpenseButton = document.getElementById("addExpenseButton");

const selectedDateInput = document.getElementById("selectedDate");
const daySummary = document.getElementById("daySummary");
const expenseList = document.getElementById("expenseList");

const currentDateTime = document.getElementById("currentDateTime");

const reportType = document.getElementById("reportType");
const reportCategory = document.getElementById("reportCategory");
const reportVehicle = document.getElementById("reportVehicle");
const reportPayment = document.getElementById("reportPayment");

const reportStartDate = document.getElementById("reportStartDate");
const reportEndDate = document.getElementById("reportEndDate");

const generateReportButton =
    document.getElementById("generateReportButton");


// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------

function pad(number) {
    return String(number).padStart(2, "0");
}


function getTodayString() {
    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate())
    );
}


function getCurrentTime() {
    const now = new Date();

    return (
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes())
    );
}


function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function formatMoney(value) {
    return Number(value).toLocaleString("el-GR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " €";
}


function saveExpenses() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(expenses)
    );
}


// ------------------------------------------------------
// TEXT TRANSLATIONS
// ------------------------------------------------------

function getCategoryName(category) {

    const categories = {
        fuel: "Βενζίνη",
        food: "Φαγητό",
        tickets: "Εισιτήρια",
        coffee: "Καφέ",
        shopping: "Αγορά",
        maintenance: "Συντήρηση οχήματος",
        other: "Διάφορα"
    };

    return categories[category] || "";
}


function getPaymentName(payment) {

    if (payment === "cash") {
        return "Μετρητά";
    }

    if (payment === "card") {
        return "Κάρτα";
    }

    return "";
}


function getVehicleName(vehicle) {

    if (vehicle === "car") {
        return "Αυτοκίνητο";
    }

    if (vehicle === "motorcycle") {
        return "Μηχανή";
    }

    return "";
}


// ------------------------------------------------------
// CURRENT DATE / TIME
// ------------------------------------------------------

function updateCurrentDateTime() {

    const now = new Date();

    const date =
        pad(now.getDate()) +
        "/" +
        pad(now.getMonth() + 1) +
        "/" +
        now.getFullYear();

    const time =
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes()) +
        ":" +
        pad(now.getSeconds());

    currentDateTime.textContent =
        `${date} — ${time}`;
}


setInterval(updateCurrentDateTime, 1000);
updateCurrentDateTime();


// ------------------------------------------------------
// INITIAL DATE
// ------------------------------------------------------

selectedDateInput.value = getTodayString();

reportStartDate.value = getTodayString();
reportEndDate.value = getTodayString();


// ------------------------------------------------------
// VEHICLE FIELD
// ------------------------------------------------------

function updateVehicleField() {

    const category = categorySelect.value;

    if (
        category === "fuel" ||
        category === "maintenance"
    ) {

        vehicleContainer.classList.remove("hidden");

    } else {

        vehicleContainer.classList.add("hidden");
        vehicleSelect.value = "";
    }
}


categorySelect.addEventListener(
    "change",
    updateVehicleField
);


// ------------------------------------------------------
// ADD EXPENSE
// ------------------------------------------------------

addExpenseButton.addEventListener(
    "click",
    addExpense
);


function addExpense() {

    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {

        alert("Παρακαλώ εισάγετε έγκυρο ποσό.");

        amountInput.focus();

        return;
    }


    const category = categorySelect.value;

    let vehicle = "";

    if (
        category === "fuel" ||
        category === "maintenance"
    ) {

        vehicle = vehicleSelect.value;
    }


    const expense = {

        id: Date.now(),

        date: getTodayString(),

        time: getCurrentTime(),

        amount: Number(amount.toFixed(2)),

        payment: paymentMethod.value,

        category: category,

        vehicle: vehicle,

        description:
            descriptionInput.value.trim()

    };


    expenses.push(expense);

    saveExpenses();


    // Clear fields

    amountInput.value = "";

    paymentMethod.value = "cash";

    categorySelect.value = "";

    vehicleSelect.value = "";

    descriptionInput.value = "";

    vehicleContainer.classList.add("hidden");


    // Show today's expenses

    selectedDateInput.value = expense.date;

    renderDay(expense.date);


    alert("Το έξοδο καταχωρήθηκε.");

}


// ------------------------------------------------------
// RENDER DAY
// ------------------------------------------------------

selectedDateInput.addEventListener(
    "change",
    function () {

        renderDay(
            selectedDateInput.value
        );

    }
);


function renderDay(date) {

    const dayExpenses = expenses
        .filter(expense => expense.date === date)
        .sort((a, b) => {

            return a.time.localeCompare(b.time);

        });


    // ---------------------------------------------
    // TOTALS
    // ---------------------------------------------

    let cashTotal = 0;
    let cardTotal = 0;
    let total = 0;


    dayExpenses.forEach(expense => {

        total += expense.amount;

        if (expense.payment === "cash") {
            cashTotal += expense.amount;
        }

        if (expense.payment === "card") {
            cardTotal += expense.amount;
        }

    });


    daySummary.innerHTML = `

        <div class="summary-row">
            <span>Μετρητά</span>
            <strong>${formatMoney(cashTotal)}</strong>
        </div>

        <div class="summary-row">
            <span>Κάρτα</span>
            <strong>${formatMoney(cardTotal)}</strong>
        </div>

        <div class="summary-row summary-total">
            <span>Σύνολο ημέρας</span>
            <strong>${formatMoney(total)}</strong>
        </div>

    `;


    // ---------------------------------------------
    // EXPENSE LIST
    // ---------------------------------------------

    expenseList.innerHTML = "";


    if (dayExpenses.length === 0) {

        expenseList.innerHTML = `
            <p style="text-align:center;color:#777;">
                Δεν υπάρχουν έξοδα για αυτή την ημέρα.
            </p>
        `;

        return;
    }


    dayExpenses.forEach(expense => {

        const item = document.createElement("div");

        item.className = "expense-item";


        let details = `
            ${expense.time} — 
            ${getPaymentName(expense.payment)}
        `;


        if (expense.category) {

            details +=
                ` — ${getCategoryName(expense.category)}`;
        }


        if (expense.vehicle) {

            details +=
                ` — ${getVehicleName(expense.vehicle)}`;
        }


        if (expense.description) {

            details +=
                ` — ${escapeHtml(expense.description)}`;
        }


        item.innerHTML = `

            <div class="expense-main">

                <div>
                    <div class="expense-details">
                        ${details}
                    </div>
                </div>

                <div class="expense-amount">
                    ${formatMoney(expense.amount)}
                </div>

            </div>

        `;


        expenseList.appendChild(item);

    });

}


// ------------------------------------------------------
// ESCAPE HTML
// ------------------------------------------------------

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ------------------------------------------------------
// REPORT DATE LOGIC
// ------------------------------------------------------

reportType.addEventListener(
    "change",
    updateReportDates
);


function updateReportDates() {

    const today = new Date();

    let start = new Date(today);
    let end = new Date(today);


    if (reportType.value === "day") {

        start = new Date(today);
        end = new Date(today);

    }


    if (reportType.value === "week") {

        const day = today.getDay();

        const difference =
            day === 0 ? 6 : day - 1;

        start.setDate(
            today.getDate() - difference
        );

        end = new Date(start);

        end.setDate(
            start.getDate() + 6
        );

    }


    if (reportType.value === "month") {

        start = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        end = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        );

    }


    if (reportType.value === "year") {

        start = new Date(
            today.getFullYear(),
            0,
            1
        );

        end = new Date(
            today.getFullYear(),
            11,
            31
        );

    }


    if (reportType.value !== "custom") {

        reportStartDate.value =
            dateToInputValue(start);

        reportEndDate.value =
            dateToInputValue(end);

    }

}


function dateToInputValue(date) {

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    );

}


// ------------------------------------------------------
// REPORT FILTERING
// ------------------------------------------------------

function getFilteredExpenses() {

    const start = reportStartDate.value;
    const end = reportEndDate.value;

    if (!start || !end) {

        alert(
            "Παρακαλώ επιλέξτε ημερομηνίες."
        );

        return [];

    }


    let filtered = expenses.filter(expense => {

        return (
            expense.date >= start &&
            expense.date <= end
        );

    });


    // Category

    if (reportCategory.value !== "all") {

        filtered = filtered.filter(
            expense =>
                expense.category ===
                reportCategory.value
        );

    }


    // Vehicle

    if (reportVehicle.value !== "all") {

        filtered = filtered.filter(
            expense =>
                expense.vehicle ===
                reportVehicle.value
        );

    }


    // Payment

    if (reportPayment.value !== "all") {

        filtered = filtered.filter(
            expense =>
                expense.payment ===
                reportPayment.value
        );

    }


    return filtered.sort((a, b) => {

        const first =
            `${a.date} ${a.time}`;

        const second =
            `${b.date} ${b.time}`;

        return first.localeCompare(second);

    });

}


// ------------------------------------------------------
// REPORT TOTALS
// ------------------------------------------------------

function calculateTotals(list) {

    let cash = 0;
    let card = 0;
    let total = 0;


    list.forEach(expense => {

        total += expense.amount;

        if (expense.payment === "cash") {
            cash += expense.amount;
        }

        if (expense.payment === "card") {
            card += expense.amount;
        }

    });


    return {
        cash,
        card,
        total
    };

}


// ------------------------------------------------------
// CATEGORY TOTALS
// ------------------------------------------------------

function calculateCategoryTotals(list) {

    const totals = {};

    list.forEach(expense => {

        const category =
            expense.category || "other";

        if (!totals[category]) {
            totals[category] = 0;
        }

        totals[category] += expense.amount;

    });


    return totals;

}


// ------------------------------------------------------
// VEHICLE TOTALS
// ------------------------------------------------------

function calculateVehicleTotals(list) {

    const totals = {

        car: 0,

        motorcycle: 0

    };


    list.forEach(expense => {

        if (
            expense.vehicle === "car"
        ) {

            totals.car += expense.amount;

        }


        if (
            expense.vehicle === "motorcycle"
        ) {

            totals.motorcycle +=
                expense.amount;

        }

    });


    return totals;

}


// ------------------------------------------------------
// LOAD jsPDF
// ------------------------------------------------------

function loadJsPDF() {

    return new Promise(
        (resolve, reject) => {

            if (window.jspdf) {

                resolve();

                return;
            }


            const script =
                document.createElement("script");

            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

            script.onload = resolve;

            script.onerror = reject;

            document.head.appendChild(script);

        }
    );

}


// ------------------------------------------------------
// GENERATE PDF
// ------------------------------------------------------

generateReportButton.addEventListener(
    "click",
    generatePDF
);


async function generatePDF() {

    const filtered =
        getFilteredExpenses();


    if (filtered.length === 0) {

        alert(
            "Δεν υπάρχουν έξοδα για τα συγκεκριμένα φίλτρα."
        );

        return;
    }


    try {

        await loadJsPDF();

    } catch (error) {

        alert(
            "Δεν ήταν δυνατή η φόρτωση του PDF."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF();


    const totals =
        calculateTotals(filtered);


    const categoryTotals =
        calculateCategoryTotals(filtered);


    const vehicleTotals =
        calculateVehicleTotals(filtered);


    // ---------------------------------------------
    // TITLE
    // ---------------------------------------------

    doc.setFontSize(20);

    doc.text(
        "DAILY EXPENSES",
        20,
        20
    );


    doc.setFontSize(12);

    doc.text(
        `Περίοδος: ${formatDate(
            reportStartDate.value
        )} - ${formatDate(
            reportEndDate.value
        )}`,
        20,
        30
    );


    // ---------------------------------------------
    // FILTERS
    // ---------------------------------------------

    let y = 42;

    doc.setFontSize(10);

    doc.text(
        `Κατηγορία: ${
            reportCategory.value === "all"
                ? "Όλες"
                : getCategoryName(
                    reportCategory.value
                  )
        }`,
        20,
        y
    );

    y += 6;


    doc.text(
        `Όχημα: ${
            reportVehicle.value === "all"
                ? "Όλα"
                : getVehicleName(
                    reportVehicle.value
                  )
        }`,
        20,
        y
    );

    y += 6;


    doc.text(
        `Πληρωμή: ${
            reportPayment.value === "all"
                ? "Όλα"
                : getPaymentName(
                    reportPayment.value
                  )
        }`,
        20,
        y
    );


    // ---------------------------------------------
    // SUMMARY
    // ---------------------------------------------

    y += 12;

    doc.setFontSize(14);

    doc.text(
        "ΣΥΝΟΨΗ",
        20,
        y
    );


    y += 8;

    doc.setFontSize(11);

    doc.text(
        `Μετρητά: ${formatMoney(
            totals.cash
        )}`,
        20,
        y
    );


    y += 7;

    doc.text(
        `Κάρτα: ${formatMoney(
            totals.card
        )}`,
        20,
        y
    );


    y += 7;

    doc.text(
        `ΣΥΝΟΛΟ: ${formatMoney(
            totals.total
        )}`,
        20,
        y
    );


    // ---------------------------------------------
    // CATEGORY SUMMARY
    // ---------------------------------------------

    y += 14;

    doc.setFontSize(14);

    doc.text(
        "ΑΝΑ ΚΑΤΗΓΟΡΙΑ",
        20,
        y
    );


    y += 8;

    doc.setFontSize(10);


    Object.keys(categoryTotals).forEach(
        category => {

            if (y > 270) {

                doc.addPage();

                y = 20;

            }


            doc.text(
                `${getCategoryName(
                    category
                )}: ${formatMoney(
                    categoryTotals[category]
                )}`,
                20,
                y
            );

            y += 6;

        }
    );


    // ---------------------------------------------
    // VEHICLE SUMMARY
    // ---------------------------------------------

    if (
        vehicleTotals.car > 0 ||
        vehicleTotals.motorcycle > 0
    ) {

        y += 8;

        doc.setFontSize(14);

        doc.text(
            "ΑΝΑ ΟΧΗΜΑ",
            20,
            y
        );


        y += 8;

        doc.setFontSize(10);


        if (vehicleTotals.car > 0) {

            doc.text(
                `Αυτοκίνητο: ${formatMoney(
                    vehicleTotals.car
                )}`,
                20,
                y
            );

            y += 6;

        }


        if (
            vehicleTotals.motorcycle > 0
        ) {

            doc.text(
                `Μηχανή: ${formatMoney(
                    vehicleTotals.motorcycle
                )}`,
                20,
                y
            );

            y += 6;

        }

    }


    // ---------------------------------------------
    // DETAILS
    // ---------------------------------------------

    y += 10;

    doc.setFontSize(14);

    doc.text(
        "ΑΝΑΛΥΤΙΚΕΣ ΕΓΓΡΑΦΕΣ",
        20,
        y
    );


    y += 8;

    doc.setFontSize(9);


    filtered.forEach(expense => {

        if (y > 275) {

            doc.addPage();

            y = 20;

        }


        let line =
            `${formatDate(
                expense.date
            )} ${expense.time} | `;


        line +=
            `${formatMoney(
                expense.amount
            )} | `;


        line +=
            `${getPaymentName(
                expense.payment
            )}`;


        if (expense.category) {

            line +=
                ` | ${getCategoryName(
                    expense.category
                )}`;

        }


        if (expense.vehicle) {

            line +=
                ` | ${getVehicleName(
                    expense.vehicle
                )}`;

        }


        if (expense.description) {

            line +=
                ` | ${expense.description}`;

        }


        // Limit line length

        const lines =
            doc.splitTextToSize(
                line,
                170
            );


        doc.text(
            lines,
            20,
            y
        );


        y +=
            5 * lines.length + 2;

    });


    // ---------------------------------------------
    // SAVE PDF
    // ---------------------------------------------

    const fileName =
        `Daily-Expenses-${reportStartDate.value}-${reportEndDate.value}.pdf`;


    doc.save(fileName);

}


// ------------------------------------------------------
// INITIAL DISPLAY
// ------------------------------------------------------

renderDay(
    selectedDateInput.value
);

updateReportDates();