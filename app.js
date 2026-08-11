"use strict";

/* =========================================================
   DAILY EXPENSES
   app.js
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const EXPENSES_KEY = "dailyExpenses_expenses_v3";
const SETTINGS_KEY = "dailyExpenses_settings_v3";


const DEFAULT_SETTINGS = {

    categories: [
        "Οχήματα",
        "Φαγητό",
        "Καφέ",
        "Αγορές",
        "Διάφορα",
        "Διασκέδαση"
    ],

    shoppingSubcategories: [
        "Super Market",
        "Gadgets",
        "Ρούχα",
        "Σπίτι",
        "Διάφορες αγορές",
        "Εισιτήρια",
        "Άλλο"
    ],

    paymentMethods: [
        "Κάρτα",
        "Μετρητά",
        "IRIS",
        "Τραπεζικός λογαριασμός"
    ],

    persons: [
        "Εμένα",
        "Οικογένεια",
        "Άλλος"
    ],

    vehicles: []
};


let expenses = loadData(
    EXPENSES_KEY,
    []
);


let settings = loadData(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
);


let editingExpenseId = null;


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function clone(value) {
    return JSON.parse(
        JSON.stringify(value)
    );
}


function loadData(key, fallback) {

    try {

        const stored =
            localStorage.getItem(key);

        if (stored !== null) {
            return JSON.parse(stored);
        }

    } catch (error) {

        console.error(
            "Σφάλμα φόρτωσης δεδομένων:",
            error
        );

    }

    return clone(fallback);
}


function saveExpenses() {

    localStorage.setItem(
        EXPENSES_KEY,
        JSON.stringify(expenses)
    );
}


function saveSettings() {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );
}


function today() {

    const d = new Date();

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
}


function nowTime() {

    const d = new Date();

    return (
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0")
    );
}


function formatDate(value) {

    if (!value) {
        return "";
    }

    const parts =
        String(value).split("-");

    if (parts.length !== 3) {
        return value;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


function money(value) {

    return Number(value || 0).toLocaleString(
        "el-GR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";
}


function number(value) {

    return Number(value || 0).toLocaleString(
        "el-GR",
        {
            maximumFractionDigits: 2
        }
    );
}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : String(value);

    return div.innerHTML;
}


function createId(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


/* =========================================================
   SETTINGS MIGRATION
   ========================================================= */

function migrateSettings() {

    if (
        !settings ||
        typeof settings !== "object"
    ) {
        settings =
            clone(DEFAULT_SETTINGS);
    }


    const ensureArray =
        function(property, fallback) {

            if (
                !Array.isArray(
                    settings[property]
                )
            ) {
                settings[property] =
                    clone(fallback);
            }

        };


    ensureArray(
        "categories",
        DEFAULT_SETTINGS.categories
    );


    ensureArray(
        "shoppingSubcategories",
        DEFAULT_SETTINGS.shoppingSubcategories
    );


    ensureArray(
        "paymentMethods",
        DEFAULT_SETTINGS.paymentMethods
    );


    ensureArray(
        "persons",
        DEFAULT_SETTINGS.persons
    );


    ensureArray(
        "vehicles",
        []
    );


    settings.vehicles =
        settings.vehicles.map(
            function(vehicle) {

                if (
                    typeof vehicle === "string"
                ) {

                    return {

                        id:
                            createId("vehicle"),

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


                return {

                    id:
                        vehicle.id ||
                        createId("vehicle"),

                    type:
                        vehicle.type ||
                        "Αυτοκίνητο",

                    make:
                        vehicle.make ||
                        "",

                    model:
                        vehicle.model ||
                        "",

                    plate:
                        vehicle.plate ||
                        ""

                };

            }
        );


    DEFAULT_SETTINGS.categories
        .forEach(
            function(category) {

                if (
                    !settings.categories.includes(
                        category
                    )
                ) {

                    settings.categories.push(
                        category
                    );

                }

            }
        );


    DEFAULT_SETTINGS.shoppingSubcategories
        .forEach(
            function(item) {

                if (
                    !settings.shoppingSubcategories.includes(
                        item
                    )
                ) {

                    settings.shoppingSubcategories.push(
                        item
                    );

                }

            }
        );


    if (
        !settings.paymentMethods.includes(
            "Κάρτα"
        )
    ) {

        settings.paymentMethods.unshift(
            "Κάρτα"
        );

    }


    if (
        !settings.persons.includes(
            "Εμένα"
        )
    ) {

        settings.persons.unshift(
            "Εμένα"
        );

    }


    saveSettings();
}


migrateSettings();


/* =========================================================
   SELECT HELPERS
   ========================================================= */

function fillSelect(
    select,
    values,
    placeholder,
    includeAll
) {

    if (!select) {
        return;
    }


    select.innerHTML = "";


    if (placeholder !== null) {

        const first =
            document.createElement("option");

        first.value = "";

        first.textContent =
            placeholder;

        select.appendChild(first);

    }


    if (includeAll) {

        const all =
            document.createElement("option");

        all.value = "all";

        all.textContent = "Όλα";

        select.appendChild(all);

    }


    values.forEach(
        function(value) {

            const option =
                document.createElement("option");

            option.value = value;

            option.textContent = value;

            select.appendChild(option);

        }
    );
}


/* =========================================================
   MAIN SELECTS
   ========================================================= */

function populateMainSelects() {

    fillSelect(
        $("category"),
        settings.categories,
        "Επιλέξτε κατηγορία",
        false
    );


    fillSelect(
        $("paymentMethod"),
        settings.paymentMethods,
        "Επιλέξτε τρόπο πληρωμής",
        false
    );


    fillSelect(
        $("person"),
        settings.persons,
        "Επιλέξτε για ποιον",
        false
    );


    fillSelect(
        $("reportCategory"),
        settings.categories,
        null,
        true
    );


    fillSelect(
        $("reportPerson"),
        settings.persons,
        null,
        true
    );


    fillSelect(
        $("reportPayment"),
        settings.paymentMethods,
        null,
        true
    );


    populateShoppingSubcategories();
    populateReportVehicles();

    setDefaultValues();

    updateCategoryInterface();
    updatePurchaseInterface();
    updateReportInterface();
}


/* =========================================================
   DEFAULT VALUES
   ========================================================= */

function setDefaultValues() {

    if ($("paymentMethod")) {
        $("paymentMethod").value = "Κάρτα";
    }


    if ($("person")) {
        $("person").value = "Εμένα";
    }


    if ($("purchaseMethod")) {
        $("purchaseMethod").value = "store";
    }
}


/* =========================================================
   SHOPPING
   ========================================================= */

function populateShoppingSubcategories() {

    fillSelect(
        $("subcategory"),
        settings.shoppingSubcategories,
        "Επιλέξτε είδος αγοράς",
        false
    );
}


/* =========================================================
   VEHICLES
   ========================================================= */

function vehicleDisplayName(vehicle) {

    const parts = [];


    if (vehicle.make) {
        parts.push(vehicle.make);
    }


    if (vehicle.model) {
        parts.push(vehicle.model);
    }


    let result =
        parts.join(" ");


    if (vehicle.plate) {

        if (result) {
            result += " - ";
        }

        result += vehicle.plate;

    }


    return (
        result ||
        "Όχημα χωρίς στοιχεία"
    );
}


function getVehiclesByType(type) {

    return settings.vehicles.filter(
        function(vehicle) {

            return vehicle.type === type;

        }
    );
}


/*
 * ΣΗΜΑΝΤΙΚΟ:
 * Η προηγούμενη έκδοση ανανέωνε το select
 * αφού είχε πάρει την επιλογή του χρήστη.
 *
 * Τώρα πρώτα δημιουργούμε τη λίστα
 * και ΜΕΤΑ επιλέγουμε το όχημα.
 */

function populateVehicles(selectedId = "") {

    const select =
        $("vehicle");


    if (!select) {
        return;
    }


    const type =
        $("vehicleType")
            ? $("vehicleType").value
            : "";


    select.innerHTML = "";


    const first =
        document.createElement("option");


    first.value = "";


    if (type === "Αυτοκίνητο") {

        first.textContent =
            "Επιλέξτε αυτοκίνητο";

    } else if (type === "Μηχανή") {

        first.textContent =
            "Επιλέξτε μηχανή";

    } else {

        first.textContent =
            "Επιλέξτε όχημα";

    }


    select.appendChild(first);


    if (!type) {

        toggle(
            "vehicleEmptyMessage",
            false
        );

        return;

    }


    const vehicles =
        getVehiclesByType(type);


    vehicles.forEach(
        function(vehicle) {

            const option =
                document.createElement("option");

            option.value =
                vehicle.id;

            option.textContent =
                vehicleDisplayName(
                    vehicle
                );

            select.appendChild(option);

        }
    );


    if (selectedId) {

        const exists =
            vehicles.some(
                function(vehicle) {

                    return (
                        vehicle.id ===
                        selectedId
                    );

                }
            );


        if (exists) {

            select.value =
                selectedId;

        }

    }


    toggle(
        "vehicleEmptyMessage",
        vehicles.length === 0
    );
}


/* =========================================================
   VEHICLE INTERFACE
   ========================================================= */

function updateVehicleInterface() {

    const category =
        $("category")
            ? $("category").value
            : "";


    const type =
        $("vehicleType")
            ? $("vehicleType").value
            : "";


    const vehicleId =
        $("vehicle")
            ? $("vehicle").value
            : "";


    const isVehicleCategory =
        category === "Οχήματα";


    const hasType =
        isVehicleCategory &&
        (
            type === "Αυτοκίνητο" ||
            type === "Μηχανή"
        );


    /*
     * Πρώτα εμφανίζουμε/κρύβουμε
     * τον τύπο οχήματος.
     */

    toggle(
        "vehicleTypeWrap",
        isVehicleCategory
    );


    toggle(
        "vehicleWrap",
        hasType
    );


    /*
     * Μόνο αφού υπάρχει τύπος,
     * γεμίζουμε τη λίστα.
     */

    if (hasType) {

        populateVehicles(
            vehicleId
        );

    } else {

        if ($("vehicle")) {
            $("vehicle").innerHTML = "";
        }

        toggle(
            "vehicleEmptyMessage",
            false
        );

    }


    /*
     * Ξαναδιαβάζουμε την πραγματική
     * επιλογή μετά το populate.
     */

    const actualVehicleId =
        $("vehicle")
            ? $("vehicle").value
            : "";


    const hasVehicle =
        hasType &&
        actualVehicleId !== "";


    toggle(
        "vehicleExpenseTypeWrap",
        hasVehicle
    );


    const expenseType =
        $("vehicleExpenseType")
            ? $("vehicleExpenseType").value
            : "";


    const showOdometer =
        hasVehicle &&
        expenseType !== "";


    toggle(
        "odometerWrap",
        showOdometer
    );


    /*
     * Αν δεν υπάρχει συγκεκριμένο όχημα,
     * καθαρίζουμε τα επόμενα πεδία.
     */

    if (!hasVehicle) {

        if ($("vehicleExpenseType")) {
            $("vehicleExpenseType").value = "";
        }

        if ($("odometer")) {
            $("odometer").value = "";
        }

    }
}


function updateCategoryInterface() {

    const category =
        $("category")
            ? $("category").value
            : "";


    const isShopping =
        category === "Αγορές";


    const isVehicle =
        category === "Οχήματα";


    toggle(
        "subcategoryWrap",
        isShopping
    );


    toggle(
        "vehicleTypeWrap",
        isVehicle
    );


    if (!isShopping) {

        if ($("subcategory")) {
            $("subcategory").value = "";
        }

    }


    if (!isVehicle) {

        if ($("vehicleType")) {
            $("vehicleType").value = "";
        }

        if ($("vehicle")) {
            $("vehicle").value = "";
        }

        if ($("vehicleExpenseType")) {
            $("vehicleExpenseType").value = "";
        }

        if ($("odometer")) {
            $("odometer").value = "";
        }

    }


    updateVehicleInterface();
}


/* =========================================================
   PURCHASE INTERFACE
   ========================================================= */

function updatePurchaseInterface() {

    const method =
        $("purchaseMethod")
            ? $("purchaseMethod").value
            : "store";


    const internet =
        method === "internet";


    toggle(
        "orderWrap",
        internet
    );


    toggle(
        "orderStatusWrap",
        internet
    );
}


/* =========================================================
   REPORT INTERFACE
   ========================================================= */

function updateReportInterface() {

    const category =
        $("reportCategory")
            ? $("reportCategory").value
            : "all";


    const isVehicleReport =
        category === "Οχήματα";


    /*
     * Όταν δεν έχουμε επιλέξει Οχήματα,
     * κανένα στοιχείο οχήματος δεν πρέπει
     * να φορτώνει άσκοπα την οθόνη.
     */

    toggle(
        "reportVehicleWrap",
        isVehicleReport
    );


    toggle(
        "reportVehicleExpenseWrap",
        isVehicleReport &&
        $("reportVehicle") &&
        $("reportVehicle").value !== "all"
    );


    /*
     * Τα checkbox που αφορούν αποκλειστικά
     * οχήματα γίνονται επίσης δυναμικά.
     */

    const vehicleOptions =
        document.querySelectorAll(
            ".vehicle-report-option"
        );


    vehicleOptions.forEach(
        function(element) {

            element.classList.toggle(
                "hidden",
                !isVehicleReport
            );

        }
    );


    /*
     * Αν φύγουμε από τα Οχήματα,
     * αποεπιλέγουμε τα vehicle-only options.
     */

    if (!isVehicleReport) {

        [
            "reportShowVehicles",
            "reportShowOdometer",
            "reportShowCostPerKm",
            "reportShowTotalVehicleCost"
        ]
        .forEach(
            function(id) {

                if ($(id)) {
                    $(id).checked = false;
                }

            }
        );

    }
}


/* =========================================================
   TOGGLE
   ========================================================= */

function toggle(id, show) {

    const element =
        $(id);


    if (!element) {
        return;
    }


    element.classList.toggle(
        "hidden",
        !show
    );
}


/* =========================================================
   GPS
   ========================================================= */

function getLocation() {

    return new Promise(
        function(resolve) {

            if (!navigator.geolocation) {

                resolve(null);

                return;
            }


            navigator.geolocation.getCurrentPosition(

                function(position) {

                    resolve({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,

                        accuracy:
                            position.coords.accuracy || 0,

                        timestamp:
                            new Date(
                                position.timestamp ||
                                Date.now()
                            ).toISOString()

                    });

                },

                function(error) {

                    console.log(
                        "GPS μη διαθέσιμο:",
                        error.message
                    );

                    resolve(null);

                },

                {

                    enableHighAccuracy: true,

                    timeout: 5000,

                    maximumAge: 60000

                }

            );

        }
    );
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validatePayment() {

    const amount =
        Number(
            $("amount")
                ? $("amount").value
                : 0
        );


    /*
     * ΜΟΝΟ ΤΟ ΠΟΣΟ ΕΙΝΑΙ ΥΠΟΧΡΕΩΤΙΚΟ.
     */

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Συμπλήρωσε το ποσό."
        );


        if ($("amount")) {
            $("amount").focus();
        }


        return false;
    }


    return true;
}


/* =========================================================
   ADD PAYMENT
   ========================================================= */

async function addPayment() {

    if (!validatePayment()) {
        return;
    }


    const amount =
        Number(
            $("amount").value
        );


    let location = null;


    try {

        location =
            await getLocation();

    } catch (error) {

        location = null;

    }


    const category =
        $("category")
            ? $("category").value
            : "";


    const vehicleType =
        category === "Οχήματα" &&
        $("vehicleType")
            ? $("vehicleType").value
            : "";


    const vehicleId =
        category === "Οχήματα" &&
        $("vehicle")
            ? $("vehicle").value
            : "";


    const vehicle =
        settings.vehicles.find(
            function(item) {

                return (
                    item.id ===
                    vehicleId
                );

            }
        ) || null;


    const payment = {

        id:
            editingExpenseId ||
            createId("payment"),

        date:
            $("selectedDate")?.value ||
            today(),

        time:
            nowTime(),

        amount:
            Number(
                amount.toFixed(2)
            ),

        paymentMethod:
            $("paymentMethod")?.value ||
            "Κάρτα",

        person:
            $("person")?.value ||
            "Εμένα",

        purchaseMethod:
            $("purchaseMethod")?.value ||
            "store",

        category:
            category,

        shoppingSubcategory:
            category === "Αγορές"
                ? (
                    $("subcategory")?.value ||
                    ""
                )
                : "",

        vehicleType:
            vehicleType,

        vehicleId:
            vehicle
                ? vehicle.id
                : "",

        vehicleName:
            vehicle
                ? vehicleDisplayName(vehicle)
                : "",

        vehicleExpenseType:
            category === "Οχήματα"
                ? (
                    $("vehicleExpenseType")?.value ||
                    ""
                )
                : "",

        odometer:
            (
                category === "Οχήματα" &&
                $("odometer") &&
                $("odometer").value !== ""
            )
                ? Number(
                    $("odometer").value
                )
                : null,

        shop:
            $("shop")?.value.trim() ||
            "",

        orderNumber:
            $("orderNumber")?.value.trim() ||
            "",

        orderStatus:
            $("orderStatus")?.value ||
            "",

        description:
            $("description")?.value.trim() ||
            "",

        location:
            location,

        createdAt:
            new Date().toISOString()

    };


    if (editingExpenseId) {

        const index =
            expenses.findIndex(
                function(item) {

                    return (
                        String(item.id) ===
                        String(editingExpenseId)
                    );

                }
            );


        if (index >= 0) {

            if (
                !payment.location &&
                expenses[index].location
            ) {

                payment.location =
                    expenses[index].location;

            }


            expenses[index] =
                payment;

        }

    } else {

        expenses.push(
            payment
        );

    }


    saveExpenses();

    clearPaymentForm();

    renderDay();


    alert(
        editingExpenseId
            ? "Η πληρωμή ενημερώθηκε."
            : "Η πληρωμή καταχωρήθηκε."
    );
}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearPaymentForm() {

    editingExpenseId = null;


    [
        "amount",
        "category",
        "subcategory",
        "vehicleType",
        "vehicle",
        "vehicleExpenseType",
        "odometer",
        "shop",
        "orderNumber",
        "description"
    ]
    .forEach(
        function(id) {

            const element = $(id);

            if (element) {
                element.value = "";
            }

        }
    );


    setDefaultValues();


    if ($("orderStatus")) {
        $("orderStatus").value =
            "Παραγγέλθηκε";
    }


    updateCategoryInterface();

    updatePurchaseInterface();
}


/* =========================================================
   DAILY LIST
   ========================================================= */

function getPaymentsForDate(date) {

    return expenses
        .filter(
            function(item) {

                return item.date === date;

            }
        )
        .sort(
            function(a, b) {

                return String(
                    a.time || ""
                ).localeCompare(
                    String(b.time || "")
                );

            }
        );
}


function renderDay() {

    const date =
        $("selectedDate")?.value ||
        today();


    const list =
        getPaymentsForDate(date);


    const total =
        list.reduce(
            function(sum, item) {

                return (
                    sum +
                    Number(item.amount || 0)
                );

            },
            0
        );


    const count =
        list.length;


    const average =
        count
            ? total / count
            : 0;


    if ($("daySummary")) {

        $("daySummary").innerHTML = `

            <div class="summary">

                <div class="summary-box">

                    <span>
                        Σύνολο
                    </span>

                    <strong>
                        ${money(total)}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        Πληρωμές
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        Μέση πληρωμή
                    </span>

                    <strong>
                        ${money(average)}
                    </strong>

                </div>

            </div>

        `;
    }


    renderPaymentList(list);
}


/* =========================================================
   PAYMENT LIST
   ========================================================= */

function renderPaymentList(list) {

    const container =
        $("expenseList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-state">

                Δεν υπάρχουν πληρωμές
                για αυτή την ημερομηνία.

            </div>

        `;

        return;
    }


    list.forEach(
        function(payment) {

            const item =
                document.createElement("div");


            item.className =
                "expense-item";


            const details = [];


            if (payment.category) {
                details.push(
                    payment.category
                );
            }


            if (payment.shoppingSubcategory) {
                details.push(
                    payment.shoppingSubcategory
                );
            }


            if (payment.vehicleName) {
                details.push(
                    payment.vehicleName
                );
            }


            if (payment.vehicleExpenseType) {
                details.push(
                    payment.vehicleExpenseType
                );
            }


            if (
                payment.odometer !== null &&
                payment.odometer !== undefined
            ) {

                details.push(
                    "Κοντέρ: " +
                    number(payment.odometer) +
                    " km"
                );

            }


            if (payment.person) {
                details.push(
                    "Για: " +
                    payment.person
                );
            }


            if (payment.paymentMethod) {
                details.push(
                    payment.paymentMethod
                );
            }


            if (payment.shop) {
                details.push(
                    payment.shop
                );
            }


            if (payment.description) {
                details.push(
                    payment.description
                );
            }


            item.innerHTML = `

                <div class="expense-main">

                    <div>

                        <strong>

                            ${escapeHTML(
                                payment.time || ""
                            )}

                            —

                            ${escapeHTML(
                                payment.category ||
                                "Χωρίς κατηγορία"
                            )}

                        </strong>


                        <div class="expense-details">

                            ${details.map(
                                function(detail) {

                                    return `
                                        <div>
                                            ${escapeHTML(detail)}
                                        </div>
                                    `;

                                }
                            ).join("")}

                        </div>

                    </div>


                    <div class="expense-amount">

                        ${money(payment.amount)}

                    </div>

                </div>


                <div class="expense-actions">

                    <button
                        type="button"
                        class="secondary edit-payment"
                        data-id="${escapeHTML(payment.id)}">

                        Επεξεργασία

                    </button>


                    <button
                        type="button"
                        class="danger delete-payment"
                        data-id="${escapeHTML(payment.id)}">

                        Διαγραφή

                    </button>

                </div>

            `;


            container.appendChild(item);

        }
    );


    container
        .querySelectorAll(".edit-payment")
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        editPayment(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(".delete-payment")
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        deletePayment(
                            button.dataset.id
                        );

                    }
                );

            }
        );
}


/* =========================================================
   EDIT
   ========================================================= */

function editPayment(id) {

    const payment =
        expenses.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!payment) {
        return;
    }


    editingExpenseId =
        payment.id;


    if ($("selectedDate")) {
        $("selectedDate").value =
            payment.date || today();
    }


    if ($("amount")) {
        $("amount").value =
            payment.amount || "";
    }


    if ($("paymentMethod")) {
        $("paymentMethod").value =
            payment.paymentMethod ||
            "Κάρτα";
    }


    if ($("person")) {
        $("person").value =
            payment.person ||
            "Εμένα";
    }


    if ($("purchaseMethod")) {
        $("purchaseMethod").value =
            payment.purchaseMethod ||
            "store";
    }


    if ($("shop")) {
        $("shop").value =
            payment.shop || "";
    }


    if ($("orderNumber")) {
        $("orderNumber").value =
            payment.orderNumber || "";
    }


    if ($("orderStatus")) {
        $("orderStatus").value =
            payment.orderStatus ||
            "Παραγγέλθηκε";
    }


    if ($("description")) {
        $("description").value =
            payment.description || "";
    }


    if ($("category")) {
        $("category").value =
            payment.category || "";
    }


    updateCategoryInterface();


    if ($("subcategory")) {
        $("subcategory").value =
            payment.shoppingSubcategory || "";
    }


    if ($("vehicleType")) {
        $("vehicleType").value =
            payment.vehicleType || "";
    }


    updateVehicleInterface();


    if ($("vehicle")) {

        populateVehicles(
            payment.vehicleId || ""
        );

    }


    if ($("vehicleExpenseType")) {
        $("vehicleExpenseType").value =
            payment.vehicleExpenseType || "";
    }


    updateVehicleInterface();


    if (
        $("odometer") &&
        payment.odometer !== null &&
        payment.odometer !== undefined
    ) {

        $("odometer").value =
            payment.odometer;

    }


    updatePurchaseInterface();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


/* =========================================================
   DELETE
   ========================================================= */

function deletePayment(id) {

    const exists =
        expenses.some(
            function(item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!exists) {
        return;
    }


    if (
        !confirm(
            "Να διαγραφεί αυτή η πληρωμή;"
        )
    ) {
        return;
    }


    expenses =
        expenses.filter(
            function(item) {

                return (
                    String(item.id) !==
                    String(id)
                );

            }
        );


    saveExpenses();

    renderDay();
}


/* =========================================================
   REPORT VEHICLES
   ========================================================= */

function populateReportVehicles() {

    const select =
        $("reportVehicle");


    if (!select) {
        return;
    }


    const previous =
        select.value;


    select.innerHTML = "";


    const all =
        document.createElement("option");


    all.value = "all";

    all.textContent =
        "Όλα τα οχήματα";

    select.appendChild(all);


    settings.vehicles.forEach(
        function(vehicle) {

            const option =
                document.createElement("option");

            option.value =
                vehicle.id;

            option.textContent =
                vehicleDisplayName(vehicle);

            select.appendChild(option);

        }
    );


    if (previous) {
        select.value = previous;
    }
}


/* =========================================================
   REPORT DATES
   ========================================================= */

function updateReportDates() {

    const type =
        $("reportType")?.value ||
        "day";


    const selected =
        $("selectedDate")?.value ||
        today();


    if (type === "custom") {
        return;
    }


    const date =
        new Date(
            selected + "T12:00:00"
        );


    let start = selected;
    let end = selected;


    if (type === "week") {

        const day =
            date.getDay();


        const monday =
            new Date(date);


        const offset =
            day === 0
                ? -6
                : 1 - day;


        monday.setDate(
            date.getDate() + offset
        );


        const sunday =
            new Date(monday);


        sunday.setDate(
            monday.getDate() + 6
        );


        start =
            localDateString(monday);


        end =
            localDateString(sunday);

    }


    if (type === "month") {

        const first =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );


        const last =
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );


        start =
            localDateString(first);


        end =
            localDateString(last);

    }


    if (type === "year") {

        start =
            date.getFullYear() +
            "-01-01";


        end =
            date.getFullYear() +
            "-12-31";

    }


    if ($("reportStartDate")) {
        $("reportStartDate").value = start;
    }


    if ($("reportEndDate")) {
        $("reportEndDate").value = end;
    }
}


function localDateString(date) {

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}


/* =========================================================
   REPORT FILTER
   ========================================================= */

function getReportData() {

    const start =
        $("reportStartDate")?.value ||
        today();


    const end =
        $("reportEndDate")?.value ||
        start;


    const category =
        $("reportCategory")?.value ||
        "all";


    const vehicle =
        $("reportVehicle")?.value ||
        "all";


    const vehicleExpense =
        $("reportVehicleExpense")?.value ||
        "all";


    const person =
        $("reportPerson")?.value ||
        "all";


    const payment =
        $("reportPayment")?.value ||
        "all";


    return expenses.filter(
        function(item) {

            if (
                item.date < start ||
                item.date > end
            ) {
                return false;
            }


            if (
                category !== "all" &&
                item.category !== category
            ) {
                return false;
            }


            if (
                category === "Οχήματα" &&
                vehicle !== "all" &&
                item.vehicleId !== vehicle
            ) {
                return false;
            }


            if (
                category === "Οχήματα" &&
                vehicleExpense !== "all" &&
                item.vehicleExpenseType !== vehicleExpense
            ) {
                return false;
            }


            if (
                person !== "all" &&
                item.person !== person
            ) {
                return false;
            }


            if (
                payment !== "all" &&
                item.paymentMethod !== payment
            ) {
                return false;
            }


            return true;

        }
    );
}


/* =========================================================
   VEHICLE METRICS
   ========================================================= */

function calculateVehicleMetrics(list) {

    const result = [];


    const vehicleIds = [
        ...new Set(
            list
                .filter(
                    function(item) {
                        return item.vehicleId;
                    }
                )
                .map(
                    function(item) {
                        return item.vehicleId;
                    }
                )
        )
    ];


    vehicleIds.forEach(
        function(vehicleId) {

            const vehicle =
                settings.vehicles.find(
                    function(item) {
                        return (
                            item.id ===
                            vehicleId
                        );
                    }
                );


            const vehiclePayments =
                list
                    .filter(
                        function(item) {
                            return (
                                item.vehicleId ===
                                vehicleId
                            );
                        }
                    )
                    .sort(
                        function(a, b) {

                            return (
                                String(a.date)
                                    .localeCompare(
                                        String(b.date)
                                    ) ||
                                String(a.time || "")
                                    .localeCompare(
                                        String(b.time || "")
                                    )
                            );

                        }
                    );


            const odometerEntries =
                vehiclePayments
                    .filter(
                        function(item) {

                            return (
                                item.odometer !== null &&
                                item.odometer !== undefined &&
                                Number.isFinite(
                                    Number(item.odometer)
                                )
                            );

                        }
                    );


            let totalDistance = 0;

            let totalCost = 0;

            let fuelCost = 0;

            let maintenanceCost = 0;


            vehiclePayments.forEach(
                function(item) {

                    const amount =
                        Number(item.amount || 0);


                    totalCost += amount;


                    if (
                        item.vehicleExpenseType ===
                        "Βενζίνη"
                    ) {

                        fuelCost += amount;

                    }


                    if (
                        item.vehicleExpenseType ===
                        "Έξοδα συντήρησης"
                    ) {

                        maintenanceCost += amount;

                    }

                }
            );


            if (
                odometerEntries.length >= 2
            ) {

                const first =
                    Number(
                        odometerEntries[0].odometer
                    );


                const last =
                    Number(
                        odometerEntries[
                            odometerEntries.length - 1
                        ].odometer
                    );


                if (last >= first) {

                    totalDistance =
                        last - first;

                }

            }


            const costPerKm =
                totalDistance > 0
                    ? totalCost / totalDistance
                    : null;


            const fuelCostPerKm =
                totalDistance > 0
                    ? fuelCost / totalDistance
                    : null;


            result.push({

                vehicleId,

                vehicleName:
                    vehicle
                        ? vehicleDisplayName(vehicle)
                        : "Άγνωστο όχημα",

                vehicleType:
                    vehicle
                        ? vehicle.type
                        : "",

                totalCost,

                fuelCost,

                maintenanceCost,

                distance:
                    totalDistance,

                costPerKm,

                fuelCostPerKm,

                odometerEntries:
                    odometerEntries.length

            });

        }
    );


    return result;
}


/* =========================================================
   REPORT
   ========================================================= */

function generateReport() {

    const list =
        getReportData();


    if (!list.length) {

        alert(
            "Δεν υπάρχουν πληρωμές για τα επιλεγμένα φίλτρα."
        );

        return;
    }


    const start =
        $("reportStartDate")?.value ||
        today();


    const end =
        $("reportEndDate")?.value ||
        start;


    const total =
        list.reduce(
            function(sum, item) {

                return (
                    sum +
                    Number(item.amount || 0)
                );

            },
            0
        );


    const showPayments =
        $("reportShowPayments")?.checked;


    const showCategories =
        $("reportShowCategories")?.checked;


    const showSubcategories =
        $("reportShowSubcategories")?.checked;


    const showVehicles =
        $("reportShowVehicles")?.checked;


    const showOdometer =
        $("reportShowOdometer")?.checked;


    const showCostPerKm =
        $("reportShowCostPerKm")?.checked;


    const showTotalVehicleCost =
        $("reportShowTotalVehicleCost")?.checked;


    const categoryTotals = {};

    const subcategoryTotals = {};

    const vehicleTotals = {};


    list.forEach(
        function(item) {

            const category =
                item.category ||
                "Χωρίς κατηγορία";


            categoryTotals[category] =
                (
                    categoryTotals[category] ||
                    0
                ) +
                Number(item.amount || 0);


            if (item.shoppingSubcategory) {

                const sub =
                    item.shoppingSubcategory;


                subcategoryTotals[sub] =
                    (
                        subcategoryTotals[sub] ||
                        0
                    ) +
                    Number(item.amount || 0);

            }


            if (item.vehicleId) {

                const name =
                    item.vehicleName ||
                    "Άγνωστο όχημα";


                vehicleTotals[name] =
                    (
                        vehicleTotals[name] ||
                        0
                    ) +
                    Number(item.amount || 0);

            }

        }
    );


    const metrics =
        calculateVehicleMetrics(list);


    const categoryRows =
        Object.entries(categoryTotals)
            .sort(
                function(a, b) {
                    return b[1] - a[1];
                }
            )
            .map(
                function(entry) {

                    return `

                        <tr>

                            <td>
                                ${escapeHTML(entry[0])}
                            </td>

                            <td>
                                ${money(entry[1])}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    const subcategoryRows =
        Object.entries(subcategoryTotals)
            .sort(
                function(a, b) {
                    return b[1] - a[1];
                }
            )
            .map(
                function(entry) {

                    return `

                        <tr>

                            <td>
                                ${escapeHTML(entry[0])}
                            </td>

                            <td>
                                ${money(entry[1])}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    const vehicleRows =
        Object.entries(vehicleTotals)
            .sort(
                function(a, b) {
                    return b[1] - a[1];
                }
            )
            .map(
                function(entry) {

                    return `

                        <tr>

                            <td>
                                ${escapeHTML(entry[0])}
                            </td>

                            <td>
                                ${money(entry[1])}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    const metricsRows =
        metrics
            .map(
                function(item) {

                    return `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    item.vehicleName
                                )}
                            </td>

                            <td>
                                ${
                                    item.distance > 0
                                        ? number(item.distance) +
                                          " km"
                                        : "—"
                                }
                            </td>

                            <td>
                                ${money(item.totalCost)}
                            </td>

                            <td>
                                ${
                                    item.costPerKm !== null
                                        ? money(item.costPerKm) +
                                          " / km"
                                        : "—"
                                }
                            </td>

                            <td>
                                ${
                                    item.fuelCostPerKm !== null
                                        ? money(item.fuelCostPerKm) +
                                          " / km"
                                        : "—"
                                }
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    const paymentRows =
        list
            .slice()
            .sort(
                function(a, b) {

                    return (
                        String(a.date)
                            .localeCompare(
                                String(b.date)
                            ) ||
                        String(a.time || "")
                            .localeCompare(
                                String(b.time || "")
                            )
                    );

                }
            )
            .map(
                function(item) {

                    const details = [

                        item.category,

                        item.shoppingSubcategory,

                        item.vehicleName,

                        item.vehicleExpenseType,

                        item.paymentMethod,

                        item.person

                    ]
                    .filter(Boolean)
                    .join(" / ");


                    return `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    formatDate(item.date)
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    item.time || ""
                                )}
                            </td>

                            <td>
                                ${escapeHTML(details)}
                            </td>

                            <td>
                                ${
                                    item.odometer !== null &&
                                    item.odometer !== undefined
                                        ? number(item.odometer) +
                                          " km"
                                        : "—"
                                }
                            </td>

                            <td>
                                ${money(item.amount)}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    const reportWindow =
        window.open("", "_blank");


    if (!reportWindow) {

        alert(
            "Το Safari μπλόκαρε το παράθυρο του Report."
        );

        return;
    }


    let html = `

<!DOCTYPE html>

<html lang="el">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>
Daily Expenses Report
</title>

<style>

body {

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;

    color: #111827;

    margin: 30px;

}

h1 {
    margin-bottom: 5px;
}

h2 {
    margin-top: 30px;
}

.meta {
    color: #6b7280;
    margin-bottom: 25px;
}

.summary {

    display: flex;

    flex-wrap: wrap;

    gap: 15px;

    margin-bottom: 30px;

}

.box {

    border: 1px solid #d1d5db;

    border-radius: 10px;

    padding: 15px;

    min-width: 150px;

}

.box strong {

    display: block;

    font-size: 21px;

    margin-top: 5px;

}

table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 12px;

}

th,
td {

    border: 1px solid #d1d5db;

    padding: 8px;

    text-align: left;

}

th {
    background: #f3f4f6;
}

.total {

    text-align: right;

    font-size: 21px;

    font-weight: 700;

    margin-top: 20px;

}

.print-button {

    margin-top: 25px;

    padding: 10px 18px;

    border: 0;

    border-radius: 8px;

    cursor: pointer;

}

@media print {

    body {
        margin: 10mm;
    }

    .print-button {
        display: none;
    }

}

</style>

</head>

<body>

<h1>
Daily Expenses
</h1>

<div class="meta">

Περίοδος:
${escapeHTML(formatDate(start))}
-
${escapeHTML(formatDate(end))}

</div>


<div class="summary">

    <div class="box">

        Πληρωμές

        <strong>
            ${list.length}
        </strong>

    </div>


    <div class="box">

        Σύνολο

        <strong>
            ${money(total)}
        </strong>

    </div>


    <div class="box">

        Μέση πληρωμή

        <strong>
            ${money(total / list.length)}
        </strong>

    </div>

</div>

`;


    if (showCategories) {

        html += `

<h2>
Σύνολα ανά κατηγορία
</h2>

<table>

<thead>

<tr>

<th>
Κατηγορία
</th>

<th>
Ποσό
</th>

</tr>

</thead>

<tbody>

${categoryRows}

</tbody>

</table>

`;

    }


    if (showSubcategories) {

        html += `

<h2>
Σύνολα ανά υποκατηγορία
</h2>

<table>

<thead>

<tr>

<th>
Υποκατηγορία
</th>

<th>
Ποσό
</th>

</tr>

</thead>

<tbody>

${subcategoryRows}

</tbody>

</table>

`;

    }


    if (
        showVehicles &&
        $("reportCategory")?.value === "Οχήματα"
    ) {

        html += `

<h2>
Σύνολα ανά όχημα
</h2>

<table>

<thead>

<tr>

<th>
Όχημα
</th>

<th>
Συνολικό κόστος
</th>

</tr>

</thead>

<tbody>

${vehicleRows}

</tbody>

</table>

`;

    }


    if (
        (
            showOdometer ||
            showCostPerKm ||
            showTotalVehicleCost
        ) &&
        $("reportCategory")?.value === "Οχήματα"
    ) {

        html += `

<h2>
Στοιχεία κόστους οχημάτων
</h2>

<table>

<thead>

<tr>

<th>
Όχημα
</th>

<th>
Διανυθείσα απόσταση
</th>

<th>
Συνολικά έξοδα
</th>

<th>
Συνολικό κόστος / km
</th>

<th>
Κόστος καυσίμου / km
</th>

</tr>

</thead>

<tbody>

${metricsRows}

</tbody>

</table>

<p>

Το κόστος ανά km υπολογίζεται όταν
υπάρχουν τουλάχιστον δύο καταχωρήσεις
με ένδειξη κοντέρ για το ίδιο όχημα.

</p>

`;

    }


    if (showPayments) {

        html += `

<h2>
Αναλυτικές πληρωμές
</h2>

<table>

<thead>

<tr>

<th>
Ημερομηνία
</th>

<th>
Ώρα
</th>

<th>
Στοιχεία
</th>

<th>
Κοντέρ
</th>

<th>
Ποσό
</th>

</tr>

</thead>

<tbody>

${paymentRows}

</tbody>

</table>

`;

    }


    html += `

<div class="total">

ΣΥΝΟΛΟ:
${money(total)}

</div>


<button
    class="print-button"
    onclick="window.print()">

Εκτύπωση / Αποθήκευση ως PDF

</button>


</body>

</html>

`;


    reportWindow.document.open();

    reportWindow.document.write(html);

    reportWindow.document.close();
}


/* =========================================================
   SETTINGS
   ========================================================= */

function openSettings() {

    const modal =
        $("settingsModal");


    if (!modal) {
        return;
    }


    renderSettings();


    modal.classList.remove("hidden");


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function closeSettings() {

    const modal =
        $("settingsModal");


    if (!modal) {
        return;
    }


    modal.classList.add("hidden");


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   SETTINGS LISTS
   ========================================================= */

function renderSimpleSettings(
    containerId,
    arrayName
) {

    const container =
        $(containerId);


    if (!container) {
        return;
    }


    container.innerHTML = "";


    settings[arrayName]
        .forEach(
            function(value, index) {

                const row =
                    document.createElement("div");


                row.className =
                    "setting-item";


                const input =
                    document.createElement("input");


                input.type = "text";

                input.value = value;


                const save =
                    document.createElement("button");


                save.type = "button";

                save.textContent =
                    "Αποθήκευση";

                save.className =
                    "secondary";


                save.addEventListener(
                    "click",
                    function() {

                        const newValue =
                            input.value.trim();


                        if (!newValue) {
                            return;
                        }


                        settings[arrayName][index] =
                            newValue;


                        saveSettings();

                        populateMainSelects();

                        renderSettings();

                    }
                );


                const remove =
                    document.createElement("button");


                remove.type = "button";

                remove.textContent =
                    "Διαγραφή";

                remove.className =
                    "danger";


                remove.addEventListener(
                    "click",
                    function() {

                        if (
                            !confirm(
                                "Να διαγραφεί αυτή η επιλογή;"
                            )
                        ) {
                            return;
                        }


                        settings[arrayName].splice(
                            index,
                            1
                        );


                        saveSettings();

                        populateMainSelects();

                        renderSettings();

                    }
                );


                row.appendChild(input);

                row.appendChild(save);

                row.appendChild(remove);

                container.appendChild(row);

            }
        );
}


/* =========================================================
   VEHICLE SETTINGS
   ========================================================= */

function renderVehicleSettings() {

    const container =
        $("vehicleSettings");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    settings.vehicles.forEach(
        function(vehicle, index) {

            const row =
                document.createElement("div");


            row.className =
                "vehicle-setting";


            row.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            vehicleDisplayName(vehicle)
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(vehicle.type)}
                    </small>

                </div>

            `;


            const edit =
                document.createElement("button");


            edit.type = "button";

            edit.textContent =
                "Επεξεργασία";

            edit.className =
                "secondary";


            edit.addEventListener(
                "click",
                function() {

                    editVehicle(index);

                }
            );


            const remove =
                document.createElement("button");


            remove.type = "button";

            remove.textContent =
                "Διαγραφή";

            remove.className =
                "danger";


            remove.addEventListener(
                "click",
                function() {

                    if (
                        !confirm(
                            "Να διαγραφεί αυτό το όχημα;"
                        )
                    ) {
                        return;
                    }


                    settings.vehicles.splice(
                        index,
                        1
                    );


                    saveSettings();

                    populateMainSelects();

                    renderSettings();

                }
            );


            row.appendChild(edit);

            row.appendChild(remove);

            container.appendChild(row);

        }
    );
}


/* =========================================================
   ADD VEHICLE
   ========================================================= */

function addVehicle() {

    const type =
        $("newVehicleType")?.value ||
        "Αυτοκίνητο";


    const make =
        $("newVehicleMake")?.value.trim() ||
        "";


    const model =
        $("newVehicleModel")?.value.trim() ||
        "";


    const plate =
        $("newVehiclePlate")?.value.trim() ||
        "";


    if (
        !make &&
        !model &&
        !plate
    ) {

        alert(
            "Συμπλήρωσε τουλάχιστον τα στοιχεία του οχήματος."
        );

        return;
    }


    settings.vehicles.push({

        id:
            createId("vehicle"),

        type,

        make,

        model,

        plate

    });


    saveSettings();

    populateMainSelects();

    renderSettings();


    [
        "newVehicleMake",
        "newVehicleModel",
        "newVehiclePlate"
    ]
    .forEach(
        function(id) {

            if ($(id)) {
                $(id).value = "";
            }

        }
    );
}


/* =========================================================
   EDIT VEHICLE
   ========================================================= */

function editVehicle(index) {

    const vehicle =
        settings.vehicles[index];


    if (!vehicle) {
        return;
    }


    const type =
        prompt(
            "Τύπος: Αυτοκίνητο ή Μηχανή",
            vehicle.type
        );


    if (
        type !== "Αυτοκίνητο" &&
        type !== "Μηχανή"
    ) {
        return;
    }


    const make =
        prompt(
            "Μάρκα",
            vehicle.make
        );


    if (make === null) {
        return;
    }


    const model =
        prompt(
            "Μοντέλο / Τύπος",
            vehicle.model
        );


    if (model === null) {
        return;
    }


    const plate =
        prompt(
            "Αριθμός κυκλοφορίας / Πινακίδα",
            vehicle.plate
        );


    if (plate === null) {
        return;
    }


    vehicle.type = type;

    vehicle.make = make.trim();

    vehicle.model = model.trim();

    vehicle.plate = plate.trim();


    saveSettings();

    populateMainSelects();

    renderSettings();
}


/* =========================================================
   ADD SIMPLE SETTING
   ========================================================= */

function addSimpleSetting(
    inputId,
    arrayName
) {

    const input =
        $(inputId);


    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    if (!value) {
        return;
    }


    if (
        settings[arrayName].some(
            function(item) {

                return (
                    item.toLowerCase() ===
                    value.toLowerCase()
                );

            }
        )
    ) {

        alert(
            "Η επιλογή υπάρχει ήδη."
        );

        return;
    }


    settings[arrayName].push(value);

    input.value = "";

    saveSettings();

    populateMainSelects();

    renderSettings();
}


/* =========================================================
   SETTINGS RENDER
   ========================================================= */

function renderSettings() {

    renderSimpleSettings(
        "categorySettings",
        "categories"
    );


    renderSimpleSettings(
        "subcategorySettings",
        "shoppingSubcategories"
    );


    renderSimpleSettings(
        "paymentSettings",
        "paymentMethods"
    );


    renderSimpleSettings(
        "personSettings",
        "persons"
    );


    renderVehicleSettings();
}


/* =========================================================
   EXPORT
   ========================================================= */

function exportData() {

    const backup = {

        version: 3,

        exportedAt:
            new Date().toISOString(),

        settings,

        expenses

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
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
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "daily-expenses-backup-" +
        today() +
        ".json";


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* =========================================================
   IMPORT
   ========================================================= */

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
                    Array.isArray(
                        data.expenses
                    )
                ) {

                    expenses =
                        data.expenses;

                }


                if (
                    data.settings &&
                    typeof data.settings ===
                    "object"
                ) {

                    settings =
                        data.settings;

                    migrateSettings();

                }


                saveExpenses();

                saveSettings();

                populateMainSelects();

                renderSettings();

                renderDay();


                alert(
                    "Τα δεδομένα εισήχθησαν επιτυχώς."
                );


            } catch (error) {

                console.error(error);

                alert(
                    "Το αρχείο δεν είναι έγκυρο."
                );

            }

        };


    reader.readAsText(file);
}


/* =========================================================
   RESET SETTINGS
   ========================================================= */

function resetSettings() {

    if (
        !confirm(
            "Να επαναφερθούν οι αρχικές ρυθμίσεις;"
        )
    ) {
        return;
    }


    settings =
        clone(DEFAULT_SETTINGS);


    saveSettings();

    populateMainSelects();

    renderSettings();
}


/* =========================================================
   DATE / TIME
   ========================================================= */

function updateDateTime() {

    const element =
        $("currentDateTime");


    if (!element) {
        return;
    }


    const now =
        new Date();


    const datePart =
        now.toLocaleDateString(
            "el-GR",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const timePart =
        now.toLocaleTimeString(
            "el-GR",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );


    element.textContent =
        datePart +
        " • " +
        timePart;
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initialize() {

    if ($("selectedDate")) {
        $("selectedDate").value =
            today();
    }


    if ($("reportStartDate")) {
        $("reportStartDate").value =
            today();
    }


    if ($("reportEndDate")) {
        $("reportEndDate").value =
            today();
    }


    populateMainSelects();

    updateDateTime();

    renderDay();

    updateReportDates();

    updateReportInterface();


    /* =====================================================
       SETTINGS
       ===================================================== */

    if ($("settingsButton")) {

        $("settingsButton")
            .addEventListener(
                "click",
                openSettings
            );

    }


    if ($("closeSettings")) {

        $("closeSettings")
            .addEventListener(
                "click",
                closeSettings
            );

    }


    if ($("settingsModal")) {

        $("settingsModal")
            .addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        $("settingsModal")
                    ) {

                        closeSettings();

                    }

                }
            );

    }


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeSettings();

            }

        }
    );


    /* =====================================================
       PAYMENT
       ===================================================== */

    if ($("addExpenseButton")) {

        $("addExpenseButton")
            .addEventListener(
                "click",
                addPayment
            );

    }


    /* =====================================================
       CATEGORY
       ===================================================== */

    if ($("category")) {

        $("category")
            .addEventListener(
                "change",
                function() {

                    updateCategoryInterface();

                }
            );

    }


    /* =====================================================
       VEHICLE TYPE
       ===================================================== */

    if ($("vehicleType")) {

        $("vehicleType")
            .addEventListener(
                "change",
                function() {

                    updateVehicleInterface();

                }
            );

    }


    /* =====================================================
       VEHICLE
       ===================================================== */

    if ($("vehicle")) {

        $("vehicle")
            .addEventListener(
                "change",
                function() {

                    updateVehicleInterface();

                }
            );

    }


    /* =====================================================
       VEHICLE EXPENSE TYPE
       ===================================================== */

    if ($("vehicleExpenseType")) {

        $("vehicleExpenseType")
            .addEventListener(
                "change",
                function() {

                    updateVehicleInterface();

                }
            );

    }


    /* =====================================================
       PURCHASE
       ===================================================== */

    if ($("purchaseMethod")) {

        $("purchaseMethod")
            .addEventListener(
                "change",
                updatePurchaseInterface
            );

    }


    /* =====================================================
       DATE
       ===================================================== */

    if ($("selectedDate")) {

        $("selectedDate")
            .addEventListener(
                "change",
                function() {

                    renderDay();

                    updateReportDates();

                }
            );

    }


    /* =====================================================
       REPORT CATEGORY
       ===================================================== */

    if ($("reportCategory")) {

        $("reportCategory")
            .addEventListener(
                "change",
                function() {

                    /*
                     * Αν αλλάξει κατηγορία,
                     * επαναφέρουμε το φίλτρο οχήματος.
                     */

                    if (
                        $("reportVehicle")
                    ) {

                        $("reportVehicle").value =
                            "all";

                    }


                    if (
                        $("reportVehicleExpense")
                    ) {

                        $("reportVehicleExpense").value =
                            "all";

                    }


                    updateReportInterface();

                }
            );

    }


    /* =====================================================
       REPORT VEHICLE
       ===================================================== */

    if ($("reportVehicle")) {

        $("reportVehicle")
            .addEventListener(
                "change",
                function() {

                    updateReportInterface();

                }
            );

    }


    /* =====================================================
       REPORT TYPE
       ===================================================== */

    if ($("reportType")) {

        $("reportType")
            .addEventListener(
                "change",
                updateReportDates
            );

    }


    /* =====================================================
       GENERATE REPORT
       ===================================================== */

    if ($("generateReportButton")) {

        $("generateReportButton")
            .addEventListener(
                "click",
                generateReport
            );

    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    if ($("addCategory")) {

        $("addCategory")
            .addEventListener(
                "click",
                function() {

                    addSimpleSetting(
                        "newCategory",
                        "categories"
                    );

                }
            );

    }


    if ($("addSubcategory")) {

        $("addSubcategory")
            .addEventListener(
                "click",
                function() {

                    addSimpleSetting(
                        "newSubcategory",
                        "shoppingSubcategories"
                    );

                }
            );

    }


    if ($("addPayment")) {

        $("addPayment")
            .addEventListener(
                "click",
                function() {

                    addSimpleSetting(
                        "newPayment",
                        "paymentMethods"
                    );

                }
            );

    }


    if ($("addPerson")) {

        $("addPerson")
            .addEventListener(
                "click",
                function() {

                    addSimpleSetting(
                        "newPerson",
                        "persons"
                    );

                }
            );

    }


    if ($("addVehicle")) {

        $("addVehicle")
            .addEventListener(
                "click",
                addVehicle
            );

    }


    if ($("exportData")) {

        $("exportData")
            .addEventListener(
                "click",
                exportData
            );

    }


    if ($("importDataButton")) {

        $("importDataButton")
            .addEventListener(
                "click",
                function() {

                    if ($("importData")) {
                        $("importData").click();
                    }

                }
            );

    }


    if ($("importData")) {

        $("importData")
            .addEventListener(
                "change",
                function(event) {

                    const file =
                        event.target.files?.[0];


                    if (file) {
                        importData(file);
                    }


                    event.target.value = "";

                }
            );

    }


    if ($("resetSettings")) {

        $("resetSettings")
            .addEventListener(
                "click",
                resetSettings
            );

    }


    /* =====================================================
       ENTER IN SETTINGS
       ===================================================== */

    const enterPairs = [

        [
            "newCategory",
            "addCategory"
        ],

        [
            "newSubcategory",
            "addSubcategory"
        ],

        [
            "newPayment",
            "addPayment"
        ],

        [
            "newPerson",
            "addPerson"
        ],

        [
            "newVehiclePlate",
            "addVehicle"
        ]

    ];


    enterPairs.forEach(
        function(pair) {

            const input = $(pair[0]);

            const button = $(pair[1]);


            if (
                input &&
                button
            ) {

                input.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            event.preventDefault();

                            button.click();

                        }

                    }
                );

            }

        }
    );


    setInterval(
        updateDateTime,
        30000
    );
}


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();

}