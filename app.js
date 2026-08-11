// ======================================================
// DAILY EXPENSES - COMPLETE APP.JS
// ======================================================

const STORAGE_KEY = "dailyExpensesV2";
const SETTINGS_KEY = "dailyExpensesSettingsV2";

// ======================================================
// DEFAULT SETTINGS
// ======================================================

const defaultSettings = {
    payments: [
        "Κάρτα",
        "Μετρητά",
        "IRIS",
        "Τραπεζικός λογαριασμός"
    ],

    categories: [
        "Βενζίνη",
        "Φαγητό",
        "Εισιτήρια",
        "Καφέ",
        "Αγορές",
        "Συντήρηση οχήματος",
        "Διάφορα"
    ],

    persons: [
        "Εμένα",
        "Οικογένεια",
        "Άλλος"
    ],

    vehicles: [
        "Αυτοκίνητο",
        "Μηχανή"
    ],

    subcategories: [
        "Super Market",
        "Ηλεκτρονικά",
        "Ρούχα",
        "Σπίτι",
        "Αυτοκίνητο",
        "Διάφορες αγορές",
        "Άλλο"
    ]
};


// ======================================================
// HELPERS
// ======================================================

function $(id) {
    return document.getElementById(id);
}


function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}


function loadJSON(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        if (data) {
            return JSON.parse(data);
        }

    } catch (error) {

        console.error("Load error:", error);

    }

    return cloneObject(fallback);
}


function saveExpenses() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(expenses)
    );

}


function saveSettings() {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}


function pad(number) {

    return String(number).padStart(2, "0");

}


function getToday() {

    const date = new Date();

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    );

}


function getCurrentTime() {

    const date = new Date();

    return (
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes())
    );

}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "el-GR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";

}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text == null ? "" : String(text);

    return div.innerHTML;

}


// ======================================================
// DATA
// ======================================================

let settings = loadJSON(
    SETTINGS_KEY,
    defaultSettings
);

let expenses = loadJSON(
    STORAGE_KEY,
    []
);


// ======================================================
// SELECTS
// ======================================================

function fillSelect(select, items, allText = null) {

    if (!select) {
        return;
    }

    select.innerHTML = "";

    if (allText !== null) {

        const option = document.createElement("option");

        option.value = "all";
        option.textContent = allText;

        select.appendChild(option);

    }

    items.forEach(item => {

        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        select.appendChild(option);

    });

}


function refreshSelects() {

    fillSelect(
        $("paymentMethod"),
        settings.payments
    );

    fillSelect(
        $("category"),
        settings.categories
    );

    fillSelect(
        $("person"),
        settings.persons
    );

    fillSelect(
        $("vehicle"),
        settings.vehicles
    );

    fillSelect(
        $("subcategory"),
        settings.subcategories
    );

    fillSelect(
        $("reportCategory"),
        settings.categories,
        "Όλες"
    );

    fillSelect(
        $("reportPerson"),
        settings.persons,
        "Όλοι"
    );

    fillSelect(
        $("reportPayment"),
        settings.payments,
        "Όλοι"
    );

    updateConditionalFields();

}


// ======================================================
// CONDITIONAL FIELDS
// ======================================================

function updateConditionalFields() {

    const category = $("category")?.value || "";

    const isFuel =
        category === "Βενζίνη";

    const isVehicle =
        category === "Βενζίνη" ||
        category === "Συντήρηση οχήματος";

    const isShopping =
        category === "Αγορές";

    const purchaseMethod =
        $("purchaseMethod")?.value || "store";

    const isInternet =
        purchaseMethod === "internet";


    $("vehicleWrap")?.classList.toggle(
        "hidden",
        !isVehicle
    );

    $("litersWrap")?.classList.toggle(
        "hidden",
        !isFuel
    );

    $("odometerWrap")?.classList.toggle(
        "hidden",
        !isFuel
    );

    $("subcategoryWrap")?.classList.toggle(
        "hidden",
        !isShopping
    );

    $("orderWrap")?.classList.toggle(
        "hidden",
        !isInternet
    );

    $("orderStatusWrap")?.classList.toggle(
        "hidden",
        !isInternet
    );

}


// ======================================================
// ADD EXPENSE
// ======================================================

function addExpense() {

    const amount = Number(
        $("amount").value
    );

    if (!amount || amount <= 0) {

        alert(
            "Παρακαλώ εισάγετε έγκυρο ποσό."
        );

        return;
    }


    const category =
        $("category").value;

    const isFuel =
        category === "Βενζίνη";

    const isInternet =
        $("purchaseMethod").value === "internet";


    const expense = {

        id: Date.now(),

        date: getToday(),

        time: getCurrentTime(),

        amount: amount,

        payment:
            $("paymentMethod").value,

        category:
            category,

        subcategory:
            category === "Αγορές"
                ? $("subcategory").value
                : "",

        person:
            $("person").value,

        purchaseMethod:
            $("purchaseMethod").value,

        shop:
            $("shop").value.trim(),

        orderNumber:
            isInternet
                ? $("orderNumber").value.trim()
                : "",

        orderStatus:
            isInternet
                ? $("orderStatus").value
                : "",

        vehicle:
            category === "Βενζίνη" ||
            category === "Συντήρηση οχήματος"
                ? $("vehicle").value
                : "",

        liters:
            isFuel
                ? Number(
                    $("liters").value || 0
                  )
                : 0,

        odometer:
            isFuel
                ? Number(
                    $("odometer").value || 0
                  )
                : 0,

        description:
            $("description").value.trim()

    };


    expenses.push(expense);

    saveExpenses();

    clearForm();

    $("selectedDate").value =
        expense.date;

    renderDay(expense.date);

    alert(
        "Το έξοδο καταχωρήθηκε."
    );

}


// ======================================================
// CLEAR FORM
// ======================================================

function clearForm() {

    $("amount").value = "";

    $("shop").value = "";

    $("orderNumber").value = "";

    $("liters").value = "";

    $("odometer").value = "";

    $("description").value = "";

    $("purchaseMethod").value = "store";

    $("category").selectedIndex = 0;

    $("paymentMethod").selectedIndex = 0;

    $("person").selectedIndex = 0;

    if ($("vehicle")) {
        $("vehicle").selectedIndex = 0;
    }

    if ($("subcategory")) {
        $("subcategory").selectedIndex = 0;
    }

    if ($("orderStatus")) {
        $("orderStatus").selectedIndex = 0;
    }

    updateConditionalFields();

}


// ======================================================
// DELETE EXPENSE
// ======================================================

function deleteExpense(id) {

    const expense = expenses.find(
        item => item.id === id
    );

    if (!expense) {
        return;
    }

    const confirmed = confirm(
        "Θέλετε να διαγράψετε αυτό το έξοδο;"
    );

    if (!confirmed) {
        return;
    }

    expenses = expenses.filter(
        item => item.id !== id
    );

    saveExpenses();

    renderDay(
        $("selectedDate").value
    );

}


// ======================================================
// RENDER DAY
// ======================================================

function renderDay(date) {

    const list = expenses
        .filter(
            expense =>
                expense.date === date
        )
        .sort(
            (a, b) =>
                a.time.localeCompare(b.time)
        );


    let cash = 0;
    let card = 0;
    let total = 0;


    list.forEach(expense => {

        const amount =
            Number(expense.amount || 0);

        total += amount;

        if (expense.payment === "Κάρτα") {
            card += amount;
        }

        if (expense.payment === "Μετρητά") {
            cash += amount;
        }

    });


    $("daySummary").innerHTML = `

        <div class="summary">

            <div class="summary-box">
                Κάρτα
                <strong>
                    ${formatMoney(card)}
                </strong>
            </div>

            <div class="summary-box">
                Μετρητά
                <strong>
                    ${formatMoney(cash)}
                </strong>
            </div>

            <div class="summary-box">
                Σύνολο
                <strong>
                    ${formatMoney(total)}
                </strong>
            </div>

        </div>

    `;


    if (!list.length) {

        $("expenseList").innerHTML = `
            <p class="muted">
                Δεν υπάρχουν έξοδα
                για αυτή την ημέρα.
            </p>
        `;

        return;
    }


    $("expenseList").innerHTML = list
        .map(expense => {

            let details =
                `${expense.time} — ` +
                `${escapeHtml(expense.payment)} — ` +
                `${escapeHtml(expense.category)} — ` +
                `${escapeHtml(expense.person)}`;


            if (expense.subcategory) {

                details +=
                    ` — ${escapeHtml(
                        expense.subcategory
                    )}`;

            }


            if (expense.vehicle) {

                details +=
                    ` — ${escapeHtml(
                        expense.vehicle
                    )}`;

            }


            if (expense.liters) {

                details +=
                    ` — ${expense.liters} L`;

            }


            if (expense.odometer) {

                details +=
                    ` — ${expense.odometer} km`;

            }


            if (
                expense.purchaseMethod ===
                "internet"
            ) {

                details += " — Internet";

                if (expense.shop) {

                    details +=
                        ` — ${escapeHtml(
                            expense.shop
                        )}`;

                }

                if (expense.orderNumber) {

                    details +=
                        ` — #${escapeHtml(
                            expense.orderNumber
                        )}`;

                }

                if (expense.orderStatus) {

                    details +=
                        ` — ${escapeHtml(
                            expense.orderStatus
                        )}`;

                }

            } else if (expense.shop) {

                details +=
                    ` — ${escapeHtml(
                        expense.shop
                    )}`;

            }


            if (expense.description) {

                details +=
                    ` — ${escapeHtml(
                        expense.description
                    )}`;

            }


            return `

                <div class="expense-item">

                    <div class="expense-main">

                        <div class="expense-details">
                            ${details}
                        </div>

                        <div class="expense-amount">
                            ${formatMoney(
                                expense.amount
                            )}
                        </div>

                    </div>

                    <button
                        class="danger delete-expense"
                        data-id="${expense.id}"
                    >
                        Διαγραφή
                    </button>

                </div>

            `;

        })
        .join("");


    document
        .querySelectorAll(".delete-expense")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    deleteExpense(
                        Number(button.dataset.id)
                    );
                }
            );

        });

}


// ======================================================
// REPORT DATES
// ======================================================

function updateReportDates() {

    const today = new Date();

    const type =
        $("reportType").value;

    let start =
        new Date(today);

    let end =
        new Date(today);


    if (type === "day") {

        start = new Date(today);
        end = new Date(today);

    }


    if (type === "week") {

        const day =
            today.getDay();

        const diff =
            day === 0 ? 6 : day - 1;

        start =
            new Date(today);

        start.setDate(
            today.getDate() - diff
        );

        end =
            new Date(start);

        end.setDate(
            start.getDate() + 6
        );

    }


    if (type === "month") {

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


    if (type === "year") {

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


    if (type !== "custom") {

        $("reportStartDate").value =
            formatDateInput(start);

        $("reportEndDate").value =
            formatDateInput(end);

    }

}


function formatDateInput(date) {

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    );

}


// ======================================================
// REPORT DATA
// ======================================================

function getReportExpenses() {

    const start =
        $("reportStartDate").value;

    const end =
        $("reportEndDate").value;

    const category =
        $("reportCategory").value;

    const person =
        $("reportPerson").value;

    const payment =
        $("reportPayment").value;


    return expenses.filter(expense => {

        if (start && expense.date < start) {
            return false;
        }

        if (end && expense.date > end) {
            return false;
        }

        if (
            category !== "all" &&
            expense.category !== category
        ) {
            return false;
        }

        if (
            person !== "all" &&
            expense.person !== person
        ) {
            return false;
        }

        if (
            payment !== "all" &&
            expense.payment !== payment
        ) {
            return false;
        }

        return true;

    }).sort(
        (a, b) => {

            const first =
                `${a.date} ${a.time}`;

            const second =
                `${b.date} ${b.time}`;

            return first.localeCompare(second);

        }
    );

}


// ======================================================
// CREATE REPORT
// ======================================================

function createReport() {

    const list =
        getReportExpenses();

    if (!list.length) {

        alert(
            "Δεν βρέθηκαν έξοδα για τα συγκεκριμένα κριτήρια."
        );

        return;

    }


    const total =
        list.reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    if (!reportWindow) {

        alert(
            "Ο browser μπλόκαρε το παράθυρο του Report. Επιτρέψτε τα pop-ups."
        );

        return;

    }


    const rows = list
        .map(expense => {

            return `

                <tr>

                    <td>
                        ${formatDate(expense.date)}
                    </td>

                    <td>
                        ${escapeHtml(expense.time)}
                    </td>

                    <td>
                        ${escapeHtml(
                            expense.category
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            expense.payment
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            expense.person
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            expense.shop || ""
                        )}
                    </td>

                    <td class="amount">
                        ${formatMoney(
                            expense.amount
                        )}
                    </td>

                </tr>

            `;

        })
        .join("");


    reportWindow.document.write(`

        <!DOCTYPE html>

        <html lang="el">

        <head>

            <meta charset="UTF-8">

            <title>
                Daily Expenses Report
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 30px;
                    color: #222;
                }

                h1 {
                    margin-bottom: 5px;
                }

                h2 {
                    margin-top: 30px;
                }

                .info {
                    margin: 15px 0;
                    line-height: 1.6;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th,
                td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background: #eee;
                }

                .amount {
                    text-align: right;
                }

                .total {
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                }

                @media print {

                    body {
                        margin: 10mm;
                    }

                    button {
                        display: none;
                    }

                }

            </style>

        </head>

        <body>

            <h1>
                Daily Expenses
            </h1>

            <div class="info">

                <strong>Αναφορά εξόδων</strong><br>

                Από:
                ${formatDate(
                    $("reportStartDate").value
                )}

                <br>

                Έως:
                ${formatDate(
                    $("reportEndDate").value
                )}

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Ημερομηνία</th>

                        <th>Ώρα</th>

                        <th>Κατηγορία</th>

                        <th>Πληρωμή</th>

                        <th>Για ποιον</th>

                        <th>Κατάστημα</th>

                        <th>Ποσό</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

            <div class="total">

                ΣΥΝΟΛΟ:
                ${formatMoney(total)}

            </div>

            <br>

            <button
                onclick="window.print()"
            >
                Εκτύπωση / Αποθήκευση ως PDF
            </button>

        </body>

        </html>

    `);


    reportWindow.document.close();

}


// ======================================================
// SETTINGS
// ======================================================

function openSettings() {

    const modal =
        $("settingsModal");

    if (!modal) {
        return;
    }

    renderSettings();

    modal.classList.remove(
        "hidden"
    );

}


function closeSettings() {

    const modal =
        $("settingsModal");

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

}


// ======================================================
// SETTINGS RENDER
// ======================================================

function renderSettings() {

    renderSettingList(
        "paymentSettings",
        settings.payments,
        "payments"
    );

    renderSettingList(
        "categorySettings",
        settings.categories,
        "categories"
    );

    renderSettingList(
        "personSettings",
        settings.persons,
        "persons"
    );

    renderSettingList(
        "vehicleSettings",
        settings.vehicles,
        "vehicles"
    );

    renderSettingList(
        "subcategorySettings",
        settings.subcategories,
        "subcategories"
    );

}


function renderSettingList(
    containerId,
    items,
    type
) {

    const container =
        $(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";


    items.forEach(
        (item, index) => {

            const row =
                document.createElement("div");

            row.className =
                "setting-row";


            row.innerHTML = `

                <span>
                    ${escapeHtml(item)}
                </span>

                <button
                    type="button"
                    class="danger"
                    data-type="${type}"
                    data-index="${index}"
                >
                    ✕
                </button>

            `;


            row
                .querySelector("button")
                .addEventListener(
                    "click",
                    () => {

                        deleteSettingItem(
                            type,
                            index
                        );

                    }
                );


            container.appendChild(row);

        }
    );

}


// ======================================================
// DELETE SETTING
// ======================================================

function deleteSettingItem(
    type,
    index
) {

    if (
        !settings[type] ||
        settings[type].length <= 1
    ) {

        alert(
            "Πρέπει να υπάρχει τουλάχιστον μία επιλογή."
        );

        return;

    }


    const item =
        settings[type][index];


    const confirmed =
        confirm(
            `Να διαγραφεί το "${item}";`
        );


    if (!confirmed) {
        return;
    }


    settings[type].splice(
        index,
        1
    );


    saveSettings();

    refreshSelects();

    renderSettings();

}


// ======================================================
// ADD SETTING
// ======================================================

function addSetting(
    type,
    inputId
) {

    const input =
        $(inputId);

    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Πληκτρολογήστε μια τιμή."
        );

        return;

    }


    if (
        settings[type]
            .some(
                item =>
                    item.toLowerCase() ===
                    value.toLowerCase()
            )
    ) {

        alert(
            "Αυτή η επιλογή υπάρχει ήδη."
        );

        return;

    }


    settings[type].push(
        value
    );


    saveSettings();

    input.value = "";

    refreshSelects();

    renderSettings();

}


// ======================================================
// RESET SETTINGS
// ======================================================

function resetSettings() {

    const confirmed =
        confirm(
            "Θέλετε να επαναφέρετε όλες τις αρχικές ρυθμίσεις;"
        );

    if (!confirmed) {
        return;
    }


    settings =
        cloneObject(
            defaultSettings
        );


    saveSettings();

    refreshSelects();

    renderSettings();

}


// ======================================================
// EXPORT DATA
// ======================================================

function exportData() {

    const data = {

        version: 2,

        exportedAt:
            new Date().toISOString(),

        settings:
            settings,

        expenses:
            expenses

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "daily-expenses-backup.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// ======================================================
// IMPORT DATA
// ======================================================

function importData(file) {

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !data ||
                    !Array.isArray(
                        data.expenses
                    ) ||
                    !data.settings
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                const confirmed =
                    confirm(
                        "Η εισαγωγή θα αντικαταστήσει τα υπάρχοντα δεδομένα. Συνέχεια;"
                    );


                if (!confirmed) {
                    return;
                }


                expenses =
                    data.expenses;


                settings =
                    data.settings;


                saveExpenses();

                saveSettings();

                refreshSelects();

                renderSettings();

                renderDay(
                    $("selectedDate").value
                );


                alert(
                    "Τα δεδομένα εισήχθησαν επιτυχώς."
                );


            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Το αρχείο δεν είναι έγκυρο backup της εφαρμογής."
                );

            }

        };


    reader.readAsText(
        file
    );

}


// ======================================================
// CURRENT DATE / TIME
// ======================================================

function updateCurrentDateTime() {

    const element =
        $("currentDateTime");

    if (!element) {
        return;
    }


    const now =
        new Date();


    element.textContent =
        now.toLocaleString(
            "el-GR",
            {
                dateStyle: "full",
                timeStyle: "short"
            }
        );

}


// ======================================================
// INITIALIZATION
// ======================================================

function initializeApp() {

    // ------------------------------
    // BUTTONS
    // ------------------------------

    $("addExpenseButton")
        ?.addEventListener(
            "click",
            addExpense
        );


    $("settingsButton")
        ?.addEventListener(
            "click",
            openSettings
        );


    $("closeSettings")
        ?.addEventListener(
            "click",
            closeSettings
        );


    $("generateReportButton")
        ?.addEventListener(
            "click",
            createReport
        );


    $("reportType")
        ?.addEventListener(
            "change",
            updateReportDates
        );


    $("selectedDate")
        ?.addEventListener(
            "change",
            event => {

                renderDay(
                    event.target.value
                );

            }
        );


    $("category")
        ?.addEventListener(
            "change",
            updateConditionalFields
        );


    $("purchaseMethod")
        ?.addEventListener(
            "change",
            updateConditionalFields
        );


    // ------------------------------
    // SETTINGS - ADD BUTTONS
    // ------------------------------

    $("addPayment")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "payments",
                    "newPayment"
                );

            }
        );


    $("addCategory")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "categories",
                    "newCategory"
                );

            }
        );


    $("addPerson")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "persons",
                    "newPerson"
                );

            }
        );


    $("addVehicle")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "vehicles",
                    "newVehicle"
                );

            }
        );


    $("addSubcategory")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "subcategories",
                    "newSubcategory"
                );

            }
        );


    // ------------------------------
    // SETTINGS - DATA
    // ------------------------------

    $("exportData")
        ?.addEventListener(
            "click",
            exportData
        );


    $("importDataButton")
        ?.addEventListener(
            "click",
            () => {

                $("importData")?.click();

            }
        );


    $("importData")
        ?.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                importData(file);

                event.target.value = "";

            }
        );


    $("resetSettings")
        ?.addEventListener(
            "click",
            resetSettings
        );


    // ------------------------------
    // CLOSE MODAL WHEN CLICKING
    // OUTSIDE THE CONTENT
    // ------------------------------

    $("settingsModal")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("settingsModal")
                ) {

                    closeSettings();

                }

            }
        );


    // ------------------------------
    // INITIAL DATA
    // ------------------------------

    refreshSelects();


    const today =
        getToday();


    if ($("selectedDate")) {

        $("selectedDate").value =
            today;

    }


    updateReportDates();


    renderDay(
        today
    );


    updateCurrentDateTime();


    setInterval(
        updateCurrentDateTime,
        30000
    );

}


// ======================================================
// START APP
// ======================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}