// ======================================================
// DAILY EXPENSES V4
// Complete application logic
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

    purchaseMethods: [
        "Φυσικό κατάστημα",
        "Internet"
    ],

    internetOrigins: [
        "Ελλάδα",
        "Εξωτερικό"
    ],

    subcategories: [
        "Super Market",
        "Ηλεκτρονικά",
        "Ρούχα",
        "Σπίτι",
        "Αυτοκίνητο",
        "Διάφορες αγορές",
        "Άλλο"
    ],

    vehicles: []

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

        console.error(
            "Load error:",
            error
        );

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

    return String(number).padStart(
        2,
        "0"
    );

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

    const parts =
        dateString.split("-");

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

    return Number(
        value || 0
    ).toLocaleString(
        "el-GR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text == null
            ? ""
            : String(text);

    return div.innerHTML;

}


// ======================================================
// DATA
// ======================================================

let settings =
    loadJSON(
        SETTINGS_KEY,
        defaultSettings
    );


let expenses =
    loadJSON(
        STORAGE_KEY,
        []
    );


// ======================================================
// MIGRATION OF OLD SETTINGS
// ======================================================

function migrateSettings() {

    let changed = false;


    if (!Array.isArray(settings.payments)) {

        settings.payments =
            cloneObject(
                defaultSettings.payments
            );

        changed = true;

    }


    if (!Array.isArray(settings.categories)) {

        settings.categories =
            cloneObject(
                defaultSettings.categories
            );

        changed = true;

    }


    if (!Array.isArray(settings.persons)) {

        settings.persons =
            cloneObject(
                defaultSettings.persons
            );

        changed = true;

    }


    if (!Array.isArray(settings.purchaseMethods)) {

        settings.purchaseMethods =
            cloneObject(
                defaultSettings.purchaseMethods
            );

        changed = true;

    }


    if (!Array.isArray(settings.internetOrigins)) {

        settings.internetOrigins =
            cloneObject(
                defaultSettings.internetOrigins
            );

        changed = true;

    }


    if (!Array.isArray(settings.subcategories)) {

        settings.subcategories =
            cloneObject(
                defaultSettings.subcategories
            );

        changed = true;

    }


    if (!Array.isArray(settings.vehicles)) {

        settings.vehicles = [];

        changed = true;

    }


    // ----------------------------------------------
    // Convert old vehicle strings to vehicle objects
    // ----------------------------------------------

    settings.vehicles =
        settings.vehicles.map(
            vehicle => {

                if (
                    typeof vehicle === "string"
                ) {

                    if (
                        vehicle === "Αυτοκίνητο"
                    ) {

                        return {

                            id:
                                "vehicle-" +
                                Date.now() +
                                "-" +
                                Math.random(),

                            type:
                                "Αυτοκίνητο",

                            make:
                                "",

                            model:
                                "",

                            plate:
                                ""

                        };

                    }


                    if (
                        vehicle === "Μηχανή"
                    ) {

                        return {

                            id:
                                "vehicle-" +
                                Date.now() +
                                "-" +
                                Math.random(),

                            type:
                                "Μηχανή",

                            make:
                                "",

                            model:
                                "",

                            plate:
                                ""

                        };

                    }


                    return {

                        id:
                            "vehicle-" +
                            Date.now() +
                            "-" +
                            Math.random(),

                        type:
                            "Αυτοκίνητο",

                        make:
                            vehicle,

                        model:
                            "",

                        plate:
                            ""

                    };

                }


                return vehicle;

            }
        );


    if (changed) {

        saveSettings();

    }

}


migrateSettings();


// ======================================================
// VEHICLE HELPERS
// ======================================================

function vehicleLabel(vehicle) {

    if (!vehicle) {

        return "";

    }


    const parts = [];


    if (vehicle.type) {

        parts.push(
            vehicle.type
        );

    }


    if (vehicle.make) {

        parts.push(
            vehicle.make
        );

    }


    if (vehicle.model) {

        parts.push(
            vehicle.model
        );

    }


    let label =
        parts.join(" ");


    if (vehicle.plate) {

        if (label) {

            label +=
                " — ";

        }

        label +=
            vehicle.plate;

    }


    return label ||
        "Όχημα χωρίς στοιχεία";

}


function findVehicle(id) {

    return settings.vehicles.find(
        vehicle =>
            String(vehicle.id) ===
            String(id)
    );

}


// ======================================================
// SELECT HELPERS
// ======================================================

function fillSelect(
    select,
    items,
    placeholder = null,
    allText = null
) {

    if (!select) {

        return;

    }


    select.innerHTML = "";


    if (placeholder !== null) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            placeholder;

        option.selected =
            true;

        select.appendChild(
            option
        );

    }


    if (allText !== null) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "all";

        option.textContent =
            allText;

        select.appendChild(
            option
        );

    }


    items.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item;

            option.textContent =
                item;

            select.appendChild(
                option
            );

        }
    );

}


function fillVehicleSelect() {

    const select =
        $("vehicle");


    if (!select) {

        return;

    }


    select.innerHTML = "";


    const empty =
        document.createElement(
            "option"
        );

    empty.value = "";

    empty.textContent =
        "Επιλέξτε όχημα";

    empty.selected = true;

    select.appendChild(
        empty
    );


    settings.vehicles.forEach(
        vehicle => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                vehicle.id;

            option.textContent =
                vehicleLabel(
                    vehicle
                );

            select.appendChild(
                option
            );

        }
    );

}


function refreshSelects() {

    // --------------------------------------------------
    // PAYMENT
    // --------------------------------------------------

    fillSelect(
        $("paymentMethod"),
        settings.payments
    );


    if ($("paymentMethod")) {

        if (
            settings.payments.includes(
                "Κάρτα"
            )
        ) {

            $("paymentMethod").value =
                "Κάρτα";

        }

    }


    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    fillSelect(
        $("category"),
        settings.categories,
        "Επιλέξτε κατηγορία"
    );


    // --------------------------------------------------
    // PERSON
    // --------------------------------------------------

    fillSelect(
        $("person"),
        settings.persons
    );


    if ($("person")) {

        if (
            settings.persons.includes(
                "Εμένα"
            )
        ) {

            $("person").value =
                "Εμένα";

        }

    }


    // --------------------------------------------------
    // PURCHASE METHOD
    // --------------------------------------------------

    setupPurchaseMethod();


    // --------------------------------------------------
    // VEHICLES
    // --------------------------------------------------

    fillVehicleSelect();


    // --------------------------------------------------
    // SUBCATEGORY
    // --------------------------------------------------

    fillSelect(
        $("subcategory"),
        settings.subcategories,
        "Επιλέξτε υποκατηγορία"
    );


    // --------------------------------------------------
    // REPORTS
    // --------------------------------------------------

    fillSelect(
        $("reportCategory"),
        settings.categories,
        null,
        "Όλες"
    );


    fillSelect(
        $("reportPerson"),
        settings.persons,
        null,
        "Όλοι"
    );


    fillSelect(
        $("reportPayment"),
        settings.payments,
        null,
        "Όλοι"
    );


    updateConditionalFields();

}


// ======================================================
// PURCHASE METHOD
// ======================================================

function setupPurchaseMethod() {

    const select =
        $("purchaseMethod");


    if (!select) {

        return;

    }


    select.innerHTML = "";


    const empty =
        document.createElement(
            "option"
        );

    empty.value = "";

    empty.textContent =
        "Επιλέξτε τρόπο αγοράς";


    // ----------------------------------------------
    // Existing preferred default:
    // Physical store
    // ----------------------------------------------

    select.appendChild(
        empty
    );


    settings.purchaseMethods.forEach(
        method => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                method ===
                "Φυσικό κατάστημα"
                    ? "store"
                    : (
                        method === "Internet"
                            ? "internet"
                            : method
                    );

            option.textContent =
                method;

            select.appendChild(
                option
            );

        }
    );


    if (
        settings.purchaseMethods.includes(
            "Φυσικό κατάστημα"
        )
    ) {

        select.value =
            "store";

    }


    updateInternetOrigin();

}


// ======================================================
// INTERNET ORIGIN
// ======================================================

function createInternetOriginField() {

    const purchaseSelect =
        $("purchaseMethod");


    if (!purchaseSelect) {

        return;

    }


    let wrapper =
        $("dynamicInternetOriginWrap");


    if (wrapper) {

        return;

    }


    wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "dynamicInternetOriginWrap";


    wrapper.className =
        "form-group";


    const label =
        document.createElement(
            "label"
        );

    label.textContent =
        "Προέλευση Internet";


    const select =
        document.createElement(
            "select"
        );

    select.id =
        "internetOrigin";


    wrapper.appendChild(
        label
    );

    wrapper.appendChild(
        select
    );


    const parent =
        purchaseSelect.parentElement;


    if (parent) {

        parent.insertBefore(
            wrapper,
            purchaseSelect.nextSibling
        );

    }


    fillSelect(
        select,
        settings.internetOrigins,
        "Επιλέξτε προέλευση"
    );

}


function removeInternetOriginField() {

    const wrapper =
        $("dynamicInternetOriginWrap");


    if (wrapper) {

        wrapper.remove();

    }

}


function updateInternetOrigin() {

    const method =
        $("purchaseMethod")?.value;


    if (
        method === "internet"
    ) {

        createInternetOriginField();

        const select =
            $("internetOrigin");


        if (select) {

            fillSelect(
                select,
                settings.internetOrigins,
                "Επιλέξτε προέλευση"
            );

        }

    } else {

        removeInternetOriginField();

    }

}


// ======================================================
// CONDITIONAL FIELDS
// ======================================================

function updateConditionalFields() {

    const category =
        $("category")?.value || "";


    const isFuel =
        category === "Βενζίνη";


    const isVehicle =
        category === "Βενζίνη" ||
        category ===
        "Συντήρηση οχήματος";


    const isShopping =
        category === "Αγορές";


    const method =
        $("purchaseMethod")?.value ||
        "";


    const isInternet =
        method === "internet";


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


    updateInternetOrigin();

}


// ======================================================
// ADD EXPENSE
// ======================================================

function addExpense() {

    const amount =
        Number(
            $("amount").value
        );


    // ONLY AMOUNT IS REQUIRED
    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Παρακαλώ εισάγετε έγκυρο ποσό."
        );

        return;

    }


    const category =
        $("category")?.value ||
        "";


    const isFuel =
        category === "Βενζίνη";


    const isInternet =
        $("purchaseMethod")?.value ===
        "internet";


    const expense = {

        id:
            Date.now(),

        date:
            getToday(),

        time:
            getCurrentTime(),

        amount:
            amount,

        payment:
            $("paymentMethod")?.value ||
            "",

        category:
            category,

        person:
            $("person")?.value ||
            "",

        purchaseMethod:
            $("purchaseMethod")?.value ||
            "",

        internetOrigin:
            isInternet
                ? (
                    $("internetOrigin")?.value ||
                    ""
                )
                : "",

        subcategory:
            category === "Αγορές"
                ? (
                    $("subcategory")?.value ||
                    ""
                )
                : "",

        vehicleId:
            isVehicleCategory(category)
                ? (
                    $("vehicle")?.value ||
                    ""
                )
                : "",

        liters:
            isFuel
                ? Number(
                    $("liters")?.value ||
                    0
                )
                : 0,

        odometer:
            isFuel
                ? Number(
                    $("odometer")?.value ||
                    0
                )
                : 0,

        shop:
            $("shop")?.value.trim() ||
            "",

        orderNumber:
            isInternet
                ? (
                    $("orderNumber")?.value.trim() ||
                    ""
                )
                : "",

        orderStatus:
            isInternet
                ? (
                    $("orderStatus")?.value ||
                    ""
                )
                : "",

        description:
            $("description")?.value.trim() ||
            ""

    };


    expenses.push(
        expense
    );


    saveExpenses();


    clearForm();


    if ($("selectedDate")) {

        $("selectedDate").value =
            expense.date;

    }


    renderDay(
        expense.date
    );


    alert(
        "Το έξοδο καταχωρήθηκε."
    );

}


function isVehicleCategory(
    category
) {

    return (
        category === "Βενζίνη" ||
        category ===
        "Συντήρηση οχήματος"
    );

}


// ======================================================
// CLEAR FORM
// ======================================================

function clearForm() {

    if ($("amount")) {
        $("amount").value = "";
    }

    if ($("shop")) {
        $("shop").value = "";
    }

    if ($("orderNumber")) {
        $("orderNumber").value = "";
    }

    if ($("liters")) {
        $("liters").value = "";
    }

    if ($("odometer")) {
        $("odometer").value = "";
    }

    if ($("description")) {
        $("description").value = "";
    }


    // Category EMPTY
    if ($("category")) {

        $("category").selectedIndex =
            0;

    }


    // Person = Εμένα
    if ($("person")) {

        if (
            settings.persons.includes(
                "Εμένα"
            )
        ) {

            $("person").value =
                "Εμένα";

        }

    }


    // Purchase = Physical Store
    if ($("purchaseMethod")) {

        $("purchaseMethod").value =
            "store";

    }


    // Payment = Card
    if ($("paymentMethod")) {

        $("paymentMethod").value =
            "Κάρτα";

    }


    if ($("vehicle")) {

        $("vehicle").selectedIndex =
            0;

    }


    if ($("subcategory")) {

        $("subcategory").selectedIndex =
            0;

    }


    if ($("orderStatus")) {

        $("orderStatus").selectedIndex =
            0;

    }


    updateConditionalFields();

}


// ======================================================
// DELETE EXPENSE
// ======================================================

function deleteExpense(id) {

    const expense =
        expenses.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!expense) {

        return;

    }


    const confirmed =
        confirm(
            "Θέλετε να διαγράψετε αυτό το έξοδο;"
        );


    if (!confirmed) {

        return;

    }


    expenses =
        expenses.filter(
            item =>
                Number(item.id) !==
                Number(id)
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

    const list =
        expenses
            .filter(
                expense =>
                    expense.date ===
                    date
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(
                        b.time
                    )
            );


    let cash = 0;

    let card = 0;

    let total = 0;


    list.forEach(
        expense => {

            const amount =
                Number(
                    expense.amount ||
                    0
                );


            total +=
                amount;


            if (
                expense.payment ===
                "Κάρτα"
            ) {

                card +=
                    amount;

            }


            if (
                expense.payment ===
                "Μετρητά"
            ) {

                cash +=
                    amount;

            }

        }
    );


    if ($("daySummary")) {

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

    }


    if (!list.length) {

        if ($("expenseList")) {

            $("expenseList").innerHTML = `

                <p class="muted">
                    Δεν υπάρχουν έξοδα
                    για αυτή την ημέρα.
                </p>

            `;

        }

        return;

    }


    if (!$("expenseList")) {

        return;

    }


    $("expenseList").innerHTML =
        list
            .map(
                expense => {

                    let details =
                        `${escapeHtml(
                            expense.time
                        )}`;


                    if (
                        expense.payment
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.payment
                            )}`;

                    }


                    if (
                        expense.category
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.category
                            )}`;

                    }


                    if (
                        expense.person
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.person
                            )}`;

                    }


                    if (
                        expense.vehicleId
                    ) {

                        const vehicle =
                            findVehicle(
                                expense.vehicleId
                            );


                        if (vehicle) {

                            details +=
                                ` — ${escapeHtml(
                                    vehicleLabel(
                                        vehicle
                                    )
                                )}`;

                        }

                    }


                    if (
                        expense.liters
                    ) {

                        details +=
                            ` — ${expense.liters} L`;

                    }


                    if (
                        expense.odometer
                    ) {

                        details +=
                            ` — ${expense.odometer} km`;

                    }


                    if (
                        expense.purchaseMethod
                    ) {

                        const methodText =
                            expense.purchaseMethod ===
                            "store"
                                ? "Φυσικό κατάστημα"
                                : (
                                    expense.purchaseMethod ===
                                    "internet"
                                        ? "Internet"
                                        : expense.purchaseMethod
                                );


                        details +=
                            ` — ${escapeHtml(
                                methodText
                            )}`;

                    }


                    if (
                        expense.internetOrigin
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.internetOrigin
                            )}`;

                    }


                    if (
                        expense.shop
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.shop
                            )}`;

                    }


                    if (
                        expense.orderNumber
                    ) {

                        details +=
                            ` — #${escapeHtml(
                                expense.orderNumber
                            )}`;

                    }


                    if (
                        expense.orderStatus
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.orderStatus
                            )}`;

                    }


                    if (
                        expense.subcategory
                    ) {

                        details +=
                            ` — ${escapeHtml(
                                expense.subcategory
                            )}`;

                    }


                    if (
                        expense.description
                    ) {

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

                }
            )
            .join("");


    document
        .querySelectorAll(
            ".delete-expense"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteExpense(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// ======================================================
// REPORT DATES
// ======================================================

function formatDateInput(date) {

    return (
        date.getFullYear() +
        "-" +
        pad(
            date.getMonth() + 1
        ) +
        "-" +
        pad(
            date.getDate()
        )
    );

}


function updateReportDates() {

    if (!$("reportType")) {

        return;

    }


    const today =
        new Date();


    const type =
        $("reportType").value;


    let start =
        new Date(today);


    let end =
        new Date(today);


    if (
        type === "week"
    ) {

        const day =
            today.getDay();


        const diff =
            day === 0
                ? 6
                : day - 1;


        start =
            new Date(today);


        start.setDate(
            today.getDate() -
            diff
        );


        end =
            new Date(start);


        end.setDate(
            start.getDate() +
            6
        );

    }


    if (
        type === "month"
    ) {

        start =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        end =
            new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );

    }


    if (
        type === "year"
    ) {

        start =
            new Date(
                today.getFullYear(),
                0,
                1
            );


        end =
            new Date(
                today.getFullYear(),
                11,
                31
            );

    }


    if (
        type !== "custom"
    ) {

        if ($("reportStartDate")) {

            $("reportStartDate").value =
                formatDateInput(
                    start
                );

        }


        if ($("reportEndDate")) {

            $("reportEndDate").value =
                formatDateInput(
                    end
                );

        }

    }

}


// ======================================================
// REPORT DATA
// ======================================================

function getReportExpenses() {

    const start =
        $("reportStartDate")?.value ||
        "";


    const end =
        $("reportEndDate")?.value ||
        "";


    const category =
        $("reportCategory")?.value ||
        "all";


    const person =
        $("reportPerson")?.value ||
        "all";


    const payment =
        $("reportPayment")?.value ||
        "all";


    return expenses
        .filter(
            expense => {

                if (
                    start &&
                    expense.date <
                    start
                ) {

                    return false;

                }


                if (
                    end &&
                    expense.date >
                    end
                ) {

                    return false;

                }


                if (
                    category !==
                    "all" &&
                    category &&
                    expense.category !==
                    category
                ) {

                    return false;

                }


                if (
                    person !==
                    "all" &&
                    person &&
                    expense.person !==
                    person
                ) {

                    return false;

                }


                if (
                    payment !==
                    "all" &&
                    payment &&
                    expense.payment !==
                    payment
                ) {

                    return false;

                }


                return true;

            }
        )
        .sort(
            (a, b) => {

                const first =
                    `${a.date} ${a.time}`;


                const second =
                    `${b.date} ${b.time}`;


                return first.localeCompare(
                    second
                );

            }
        );

}


// ======================================================
// REPORT
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
            (
                sum,
                expense
            ) =>
                sum +
                Number(
                    expense.amount ||
                    0
                ),
            0
        );


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    if (!reportWindow) {

        alert(
            "Ο browser μπλόκαρε το παράθυρο του Report."
        );

        return;

    }


    const rows =
        list
            .map(
                expense => {

                    const vehicle =
                        findVehicle(
                            expense.vehicleId
                        );


                    return `

                        <tr>

                            <td>
                                ${formatDate(
                                    expense.date
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.time
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.category ||
                                    ""
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.payment ||
                                    ""
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.person ||
                                    ""
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    vehicle
                                        ? vehicleLabel(
                                            vehicle
                                        )
                                        : ""
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.shop ||
                                    ""
                                )}
                            </td>

                            <td class="amount">
                                ${formatMoney(
                                    expense.amount
                                )}
                            </td>

                        </tr>

                    `;

                }
            )
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

                button {
                    padding: 10px 20px;
                    font-size: 16px;
                }

                @media print {

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

            <p>

                Αναφορά από
                ${formatDate(
                    $("reportStartDate")?.value
                )}

                έως

                ${formatDate(
                    $("reportEndDate")?.value
                )}

            </p>

            <table>

                <thead>

                    <tr>

                        <th>Ημερομηνία</th>

                        <th>Ώρα</th>

                        <th>Κατηγορία</th>

                        <th>Πληρωμή</th>

                        <th>Για ποιον</th>

                        <th>Όχημα</th>

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
// SETTINGS MODAL
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
        "purchaseMethodSettings",
        settings.purchaseMethods,
        "purchaseMethods"
    );


    renderSettingList(
        "internetOriginSettings",
        settings.internetOrigins,
        "internetOrigins"
    );


    renderSettingList(
        "subcategorySettings",
        settings.subcategories,
        "subcategories"
    );


    renderVehiclesSettings();

}


// ======================================================
// GENERIC SETTINGS LIST
// ======================================================

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


    container.innerHTML =
        "";


    items.forEach(
        (
            item,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "setting-row";


            row.innerHTML = `

                <span>
                    ${escapeHtml(item)}
                </span>

                <button
                    type="button"
                    class="danger"
                >
                    ✕
                </button>

            `;


            row
                .querySelector(
                    "button"
                )
                .addEventListener(
                    "click",
                    () => {

                        deleteSettingItem(
                            type,
                            index
                        );

                    }
                );


            container.appendChild(
                row
            );

        }
    );

}


// ======================================================
// VEHICLES SETTINGS
// ======================================================

function renderVehiclesSettings() {

    const container =
        $("vehicleSettings");


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    settings.vehicles.forEach(
        (
            vehicle,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "setting-row";


            row.innerHTML = `

                <span>

                    ${escapeHtml(
                        vehicleLabel(
                            vehicle
                        )
                    )}

                </span>

                <button
                    type="button"
                    class="danger"
                >
                    ✕
                </button>

            `;


            row
                .querySelector(
                    "button"
                )
                .addEventListener(
                    "click",
                    () => {

                        deleteVehicle(
                            index
                        );

                    }
                );


            container.appendChild(
                row
            );

        }
    );

}


// ======================================================
// ADD VEHICLE
// ======================================================

function addVehicle() {

    const type =
        prompt(
            "Τύπος οχήματος:\n\n" +
            "Πληκτρολογήστε Αυτοκίνητο ή Μηχανή."
        );


    if (!type) {

        return;

    }


    let vehicleType =
        type.trim();


    if (
        vehicleType.toLowerCase() ===
        "αυτοκινητο"
    ) {

        vehicleType =
            "Αυτοκίνητο";

    }


    if (
        vehicleType.toLowerCase() ===
        "μηχανη"
    ) {

        vehicleType =
            "Μηχανή";

    }


    if (
        vehicleType !==
        "Αυτοκίνητο" &&
        vehicleType !==
        "Μηχανή"
    ) {

        alert(
            "Ο τύπος πρέπει να είναι Αυτοκίνητο ή Μηχανή."
        );

        return;

    }


    const make =
        prompt(
            "Μάρκα:"
        );


    if (make === null) {

        return;

    }


    const model =
        prompt(
            "Μοντέλο:"
        );


    if (model === null) {

        return;

    }


    const plate =
        prompt(
            "Αριθμός κυκλοφορίας:"
        );


    if (plate === null) {

        return;

    }


    const vehicle = {

        id:
            "vehicle-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 9),

        type:
            vehicleType,

        make:
            make.trim(),

        model:
            model.trim(),

        plate:
            plate.trim()
                .toUpperCase()

    };


    settings.vehicles.push(
        vehicle
    );


    saveSettings();


    refreshSelects();


    renderSettings();


    alert(
        "Το όχημα προστέθηκε."
    );

}


// ======================================================
// DELETE VEHICLE
// ======================================================

function deleteVehicle(index) {

    const vehicle =
        settings.vehicles[index];


    if (!vehicle) {

        return;

    }


    const used =
        expenses.some(
            expense =>
                String(
                    expense.vehicleId
                ) ===
                String(
                    vehicle.id
                )
        );


    let message =
        `Να διαγραφεί το όχημα "${vehicleLabel(
            vehicle
        )}";`;


    if (used) {

        message +=
            "\n\nΥπάρχουν ήδη έξοδα συνδεδεμένα με αυτό το όχημα. Τα παλιά έξοδα θα παραμείνουν, αλλά δεν θα υπάρχει πλέον το όχημα στις επιλογές.";

    }


    const confirmed =
        confirm(
            message
        );


    if (!confirmed) {

        return;

    }


    settings.vehicles.splice(
        index,
        1
    );


    saveSettings();


    refreshSelects();


    renderSettings();

}


// ======================================================
// GENERIC ADD SETTING
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


    const exists =
        settings[type].some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        );


    if (exists) {

        alert(
            "Αυτή η επιλογή υπάρχει ήδη."
        );

        return;

    }


    settings[type].push(
        value
    );


    saveSettings();


    input.value =
        "";


    refreshSelects();


    renderSettings();

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
// RESET SETTINGS
// ======================================================

function resetSettings() {

    const confirmed =
        confirm(
            "Θέλετε να επαναφέρετε τις αρχικές ρυθμίσεις;"
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
// EXPORT
// ======================================================

function exportData() {

    const data = {

        version:
            4,

        exportedAt:
            new Date()
                .toISOString(),

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
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "daily-expenses-backup.json";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ======================================================
// IMPORT
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


                migrateSettings();


                saveExpenses();


                saveSettings();


                refreshSelects();


                renderSettings();


                renderDay(
                    $("selectedDate")?.value ||
                    getToday()
                );


                alert(
                    "Τα δεδομένα εισήχθησαν επιτυχώς."
                );


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Το αρχείο δεν είναι έγκυρο backup."
                );

            }

        };


    reader.readAsText(
        file
    );

}


// ======================================================
// DATE / TIME
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
                dateStyle:
                    "full",

                timeStyle:
                    "short"
            }
        );

}


// ======================================================
// INITIALIZATION
// ======================================================

function initializeApp() {

    // ----------------------------------------------
    // MAIN BUTTONS
    // ----------------------------------------------

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


    // ----------------------------------------------
    // SETTINGS - PAYMENTS
    // ----------------------------------------------

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


    // ----------------------------------------------
    // SETTINGS - CATEGORIES
    // ----------------------------------------------

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


    // ----------------------------------------------
    // SETTINGS - PERSONS
    // ----------------------------------------------

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


    // ----------------------------------------------
    // SETTINGS - PURCHASE METHODS
    // ----------------------------------------------

    $("addPurchaseMethod")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "purchaseMethods",
                    "newPurchaseMethod"
                );

            }
        );


    // ----------------------------------------------
    // SETTINGS - INTERNET ORIGINS
    // ----------------------------------------------

    $("addInternetOrigin")
        ?.addEventListener(
            "click",
            () => {

                addSetting(
                    "internetOrigins",
                    "newInternetOrigin"
                );

            }
        );


    // ----------------------------------------------
    // SETTINGS - SUBCATEGORIES
    // ----------------------------------------------

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


    // ----------------------------------------------
    // SETTINGS - VEHICLES
    // ----------------------------------------------

    $("addVehicle")
        ?.addEventListener(
            "click",
            addVehicle
        );


    // ----------------------------------------------
    // BACKUP
    // ----------------------------------------------

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


                importData(
                    file
                );


                event.target.value =
                    "";

            }
        );


    $("resetSettings")
        ?.addEventListener(
            "click",
            resetSettings
        );


    // ----------------------------------------------
    // CLOSE SETTINGS
    // ----------------------------------------------

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


    // ----------------------------------------------
    // INITIALIZE
    // ----------------------------------------------

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
// START APPLICATION
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