"use strict";

/* =========================================================
   DAILY EXPENSES
   app.js
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const EXPENSES_KEY = "dailyExpenses_expenses_v4";
const SETTINGS_KEY = "dailyExpenses_settings_v4";


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
    
    dailyLimit: 33,

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
            "Σφάλμα φόρτωσης:",
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

    const dailyLimitInput = $("dailyLimit");

    if (dailyLimitInput) {
        const value =
            parseFloat(dailyLimitInput.value);

        if (
            Number.isFinite(value) &&
            value >= 0
        ) {
            settings.dailyLimit = value;
        }
    }

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
        String(
            d.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            d.getDate()
        ).padStart(2, "0")
    );
}


function nowTime() {

    const d = new Date();

    return (
        String(
            d.getHours()
        ).padStart(2, "0") +
        ":" +
        String(
            d.getMinutes()
        ).padStart(2, "0")
    );
}

function renderTopDailyBalance() {

    const element =
        $("topDailyBalance");

    if (!element) {
        return;
    }

    const dailyLimit =
        Number(settings.dailyLimit) || 0;

    if (dailyLimit <= 0) {

        element.innerHTML = "";

        return;
    }

    const currentDate =
        today();

    const todayTotal =
        expenses
            .filter(function(item) {

                return item.date ===
                    currentDate;

            })
            .reduce(
                function(total, item) {

                    return total +
                        Number(item.amount || 0);

                },
                0
            );

    const difference =
        dailyLimit - todayTotal;


    if (difference > 0) {

        element.className =
            "top-daily-balance limit-ok";

        element.innerHTML =
            `Ημερήσιο υπόλοιπο: <strong>${money(
                difference
            )}</strong>`;

    } else if (difference === 0) {

        element.className =
            "top-daily-balance limit-achieved";

        element.innerHTML =
            `Το Ημερήσιο όριο εξαντλήθηκε`;

    } else {

        element.className =
            "top-daily-balance limit-exceeded";

        element.innerHTML =
            `Το Ημερήσιο όριο ξεπεράστηκε κατά <strong>${money(
                Math.abs(difference)
            )}</strong>`;
    }
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

    return (
        Number(value || 0).toLocaleString(
            "el-GR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) +
        " €"
    );
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
        value == null
            ? ""
            : String(value);

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


function toggle(id, visible) {

    const element = $(id);

    if (!element) {
        return;
    }

    element.classList.toggle(
        "hidden",
        !visible
    );
}


function showMessage(message) {

    alert(message);
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

if (
    typeof settings.dailyLimit !== "number" ||
    !Number.isFinite(settings.dailyLimit) ||
    settings.dailyLimit < 0
) {
    settings.dailyLimit =
        DEFAULT_SETTINGS.dailyLimit;
}

    const arrays = [
        "categories",
        "shoppingSubcategories",
        "paymentMethods",
        "persons",
        "vehicles"
    ];


    arrays.forEach(
        function(key) {

            if (
                !Array.isArray(
                    settings[key]
                )
            ) {

                settings[key] =
                    clone(
                        DEFAULT_SETTINGS[key]
                    );

            }

        }
    );


    DEFAULT_SETTINGS.categories
        .forEach(
            function(item) {

                if (
                    !settings.categories.includes(
                        item
                    )
                ) {

                    settings.categories.push(
                        item
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


    settings.vehicles =
        settings.vehicles.map(
            function(vehicle) {

                if (
                    typeof vehicle ===
                    "string"
                ) {

                    return {

                        id:
                            createId(
                                "vehicle"
                            ),

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
                        createId(
                            "vehicle"
                        ),

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


    if (
        placeholder !== null
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            placeholder;

        select.appendChild(
            option
        );

    }


    if (includeAll) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "all";

        option.textContent =
            "Όλα";

        select.appendChild(
            option
        );

    }


    values.forEach(
        function(value) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = value;

            option.textContent = value;

            select.appendChild(
                option
            );

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

    updateReportVehicles();

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

        $("paymentMethod").value =
            "Κάρτα";

    }


    if ($("person")) {

        $("person").value =
            "Εμένα";

    }


    if ($("purchaseMethod")) {

        $("purchaseMethod").value =
            "store";

    }


    if ($("reportPerson")) {

        $("reportPerson").value =
            "Εμένα";

    }


    if ($("reportPayment")) {

        $("reportPayment").value =
            "all";

    }


    if ($("reportCategory")) {

        $("reportCategory").value =
            "all";

    }


    setReportDefaultChecks();
}


/* =========================================================
   REPORT DEFAULT CHECKBOXES
   ========================================================= */

function setReportDefaultChecks() {

    const ids = [
        "reportShowPayments",
        "reportShowCategories",
        "reportShowSubcategories"
    ];


    ids.forEach(
        function(id) {

            if ($(id)) {
                $(id).checked = true;
            }

        }
    );


    const optionalIds = [
        "reportShowVehicles",
        "reportShowOdometer",
        "reportShowCostPerKm",
        "reportShowTotalVehicleCost"
    ];


    optionalIds.forEach(
        function(id) {

            if ($(id)) {
                $(id).checked = false;
            }

        }
    );
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
   VEHICLE HELPERS
   ========================================================= */

function vehicleDisplayName(vehicle) {

    const parts = [];


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


    let name =
        parts.join(" ");


    if (vehicle.plate) {

        if (name) {
            name += " - ";
        }

        name += vehicle.plate;

    }


    return (
        name ||
        "Όχημα χωρίς στοιχεία"
    );
}


function getVehiclesByType(type) {

    return settings.vehicles.filter(
        function(vehicle) {

            return (
                vehicle.type === type
            );

        }
    );
}


function getVehicleById(id) {

    if (!id) {
        return null;
    }

    return (
        settings.vehicles.find(
            function(vehicle) {

                return (
                    vehicle.id === id
                );

            }
        ) || null
    );
}


/* =========================================================
   VEHICLE SELECT
   ========================================================= */

function populateVehicleSelect(
    selectedId = ""
) {

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
        document.createElement(
            "option"
        );


    first.value = "";


    if (type === "Αυτοκίνητο") {

        first.textContent =
            "Επιλέξτε αυτοκίνητο";

    } else if (
        type === "Μηχανή"
    ) {

        first.textContent =
            "Επιλέξτε μηχανή";

    } else {

        first.textContent =
            "Επιλέξτε όχημα";

    }


    select.appendChild(
        first
    );


    if (!type) {

        toggle(
            "vehicleEmptyMessage",
            false
        );

        return;
    }


    const vehicles =
        getVehiclesByType(
            type
        );


    vehicles.forEach(
        function(vehicle) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                vehicle.id;

            option.textContent =
                vehicleDisplayName(
                    vehicle
                );

            select.appendChild(
                option
            );

        }
    );


    if (selectedId) {

        const found =
            vehicles.some(
                function(vehicle) {

                    return (
                        vehicle.id ===
                        selectedId
                    );

                }
            );


        if (found) {

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
   MAIN CATEGORY INTERFACE
   ========================================================= */

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
            $("subcategory").value =
                "";
        }

    }


    if (!isVehicle) {

        if ($("vehicleType")) {
            $("vehicleType").value =
                "";
        }


        if ($("vehicle")) {
            $("vehicle").value =
                "";
        }


        if ($("vehicleExpenseType")) {
            $("vehicleExpenseType").value =
                "";
        }


        if ($("odometer")) {
            $("odometer").value =
                "";
        }

    }


    updateVehicleInterface();
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


    const isVehicle =
        category === "Οχήματα";


    const validType =
        type === "Αυτοκίνητο" ||
        type === "Μηχανή";


    toggle(
        "vehicleTypeWrap",
        isVehicle
    );


    toggle(
        "vehicleWrap",
        isVehicle &&
        validType
    );


    if (
        isVehicle &&
        validType
    ) {

        populateVehicleSelect(
            vehicleId
        );

    } else {

        if ($("vehicle")) {
            $("vehicle").innerHTML =
                "";
        }

        toggle(
            "vehicleEmptyMessage",
            false
        );

    }


    /*
     * Το είδος δαπάνης εμφανίζεται
     * ΜΟΝΟ όταν έχει επιλεγεί
     * συγκεκριμένο όχημα.
     */

    const hasVehicle =
        isVehicle &&
        validType &&
        Boolean(
            vehicleId
        );


    toggle(
        "vehicleExpenseTypeWrap",
        hasVehicle
    );


    toggle(
        "odometerWrap",
        hasVehicle
    );


    if (!hasVehicle) {

        if ($("vehicleExpenseType")) {
            $("vehicleExpenseType").value =
                "";
        }

    }
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


    if (!internet) {

        if ($("orderNumber")) {
            $("orderNumber").value =
                "";
        }

    }
}


/* =========================================================
   REPORT VEHICLES
   ========================================================= */

function updateReportVehicles() {

    const select =
        $("reportVehicle");


    if (!select) {
        return;
    }


    const previous =
        select.value;


    select.innerHTML = "";


    const all =
        document.createElement(
            "option"
        );

    all.value = "all";

    all.textContent =
        "Όλα τα οχήματα";

    select.appendChild(
        all
    );


    settings.vehicles.forEach(
        function(vehicle) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                vehicle.id;

            option.textContent =
                vehicleDisplayName(
                    vehicle
                );

            select.appendChild(
                option
            );

        }
    );


    if (
        previous &&
        settings.vehicles.some(
            function(vehicle) {
                return (
                    vehicle.id ===
                    previous
                );
            }
        )
    ) {

        select.value =
            previous;

    }
}


/* =========================================================
   REPORT INTERFACE
   ========================================================= */

function updateReportInterface() {

    const category =
        $("reportCategory")
            ? $("reportCategory").value
            : "all";


    const isVehicle =
        category === "Οχήματα";


    /*
     * Το βασικό ζητούμενο:
     *
     * Όλα / Αγορές / Φαγητό / κλπ
     * → ΔΕΝ εμφανίζουν όχημα.
     *
     * Οχήματα
     * → εμφανίζουν όχημα.
     */

    toggle(
        "reportVehicleWrap",
        isVehicle
    );


    toggle(
        "reportVehicleExpenseWrap",
        isVehicle
    );


    document
        .querySelectorAll(
            ".vehicle-report-option"
        )
        .forEach(
            function(element) {

                element.classList.toggle(
                    "hidden",
                    !isVehicle
                );

            }
        );


    if (!isVehicle) {

        if ($("reportVehicle")) {

            $("reportVehicle").value =
                "all";

        }


        if ($("reportVehicleExpense")) {

            $("reportVehicleExpense").value =
                "all";

        }


        if ($("reportShowVehicles")) {

            $("reportShowVehicles").checked =
                false;

        }


        if ($("reportShowOdometer")) {

            $("reportShowOdometer").checked =
                false;

        }


        if ($("reportShowCostPerKm")) {

            $("reportShowCostPerKm").checked =
                false;

        }


        if (
            $("reportShowTotalVehicleCost")
        ) {

            $(
                "reportShowTotalVehicleCost"
            ).checked = false;

        }

    }
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


    const d =
        new Date();


    const date =
        d.toLocaleDateString(
            "el-GR",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const time =
        d.toLocaleTimeString(
            "el-GR",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );


    element.textContent =
        date +
        " • " +
        time;
}


/* =========================================================
   FORM DATA
   ========================================================= */

function getFormData() {

    return {

        amount:
            Number(
                $("amount").value
            ),

        paymentMethod:
            $("paymentMethod").value,

        category:
            $("category").value,

        subcategory:
            $("subcategory")
                ? $("subcategory").value
                : "",

        vehicleType:
            $("vehicleType")
                ? $("vehicleType").value
                : "",

        vehicleId:
            $("vehicle")
                ? $("vehicle").value
                : "",

        vehicleExpenseType:
            $("vehicleExpenseType")
                ? $("vehicleExpenseType").value
                : "",

        odometer:
            $("odometer")
                ? (
                    $("odometer").value === ""
                        ? null
                        : Number(
                            $("odometer").value
                        )
                )
                : null,

        person:
            $("person").value,

        purchaseMethod:
            $("purchaseMethod").value,

        shop:
            $("shop").value.trim(),

        orderNumber:
            $("orderNumber")
                ? $("orderNumber").value.trim()
                : "",

        orderStatus:
            $("orderStatus")
                ? $("orderStatus").value
                : "",

        description:
            $("description")
                .value.trim()

    };
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateExpense(data) {

    if (
        !Number.isFinite(
            data.amount
        ) ||
        data.amount <= 0
    ) {

        showMessage(
            "Παρακαλώ συμπλήρωσε το ποσό."
        );

        return false;
    }


    /*
     * ΤΙΠΟΤΑ ΑΛΛΟ ΔΕΝ ΕΙΝΑΙ ΥΠΟΧΡΕΩΤΙΚΟ.
     */

    if (
        data.category === "Οχήματα"
    ) {

        if (
            !data.vehicleType
        ) {

            showMessage(
                "Επίλεξε τύπο οχήματος."
            );

            return false;
        }


        if (
            !data.vehicleId
        ) {

            showMessage(
                "Επίλεξε ποιο όχημα."
            );

            return false;
        }


        if (
            !data.vehicleExpenseType
        ) {

            showMessage(
                "Επίλεξε είδος δαπάνης."
            );

            return false;
        }

    }


    return true;
}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetExpenseForm() {

    $("amount").value = "";

    $("category").value = "";

    $("subcategory").value = "";

    $("vehicleType").value = "";

    $("vehicle").innerHTML = "";

    $("vehicleExpenseType").value = "";

    $("odometer").value = "";

    $("shop").value = "";

    $("orderNumber").value = "";

    $("description").value = "";

    $("purchaseMethod").value =
        "store";


    setDefaultValues();

    updateCategoryInterface();

    updatePurchaseInterface();

    editingExpenseId = null;


    $("addExpenseButton").innerHTML =
        '<span class="button-plus" aria-hidden="true">+</span>Προσθήκη εξόδου';
}


/* =========================================================
   ADD / EDIT EXPENSE
   ========================================================= */

function saveExpense() {

    const data =
        getFormData();


    if (
        !validateExpense(data)
    ) {
        return;
    }


    const date =
        $("selectedDate").value ||
        today();


    const time =
        nowTime();


    const vehicle =
        getVehicleById(
            data.vehicleId
        );


    const record = {

        id:
            editingExpenseId ||
            createId("expense"),

        date:
    editingExpenseId
        ? (
            $("editExpenseDate")?.value ||
            date
        )
        : date,

time:
    editingExpenseId
        ? (
            $("editExpenseTime")?.value ||
            time
        )
        : time,

        amount:
            data.amount,

        paymentMethod:
            data.paymentMethod,

        category:
            data.category,

        subcategory:
            data.subcategory,

        vehicleType:
            data.vehicleType,

        vehicleId:
            data.vehicleId,

        vehicle:
            vehicle
                ? vehicleDisplayName(vehicle)
                : "",

        vehicleExpenseType:
            data.vehicleExpenseType,

        odometer:
            data.odometer,

        person:
            data.person,

        purchaseMethod:
            data.purchaseMethod,

        shop:
            data.shop,

        orderNumber:
            data.orderNumber,

        orderStatus:
            data.orderStatus,

        description:
            data.description

    };


    if (editingExpenseId) {

        const index =
            expenses.findIndex(
                function(item) {

                    return (
                        item.id ===
                        editingExpenseId
                    );

                }
            );


        if (index !== -1) {

            expenses[index] =
                record;

        }

    } else {

        expenses.push(
            record
        );

    }


    saveExpenses();

    renderExpenses();

    resetExpenseForm();


    showMessage(
        editingExpenseId
            ? "Η πληρωμή ενημερώθηκε."
            : "Η πληρωμή καταχωρήθηκε."
    );
}

const editDateTimeWrap =
    $("editDateTimeWrap");

if (editDateTimeWrap) {
    editDateTimeWrap.classList.add("hidden");
}

if ($("editExpenseDate")) {
    $("editExpenseDate").value = "";
}

if ($("editExpenseTime")) {
    $("editExpenseTime").value = "";
}

/* =========================================================
   EXPENSE LIST
   ========================================================= */

function renderExpenses() {

    const container =
        $("expenseList");


    if (!container) {
        return;
    }


    const date =
        $("selectedDate").value ||
        today();


    const dayExpenses =
        expenses
            .filter(
                function(item) {

                    return (
                        item.date === date
                    );

                }
            )
            .sort(
                function(a, b) {

                    return String(
                        b.time || ""
                    ).localeCompare(
                        String(
                            a.time || ""
                        )
                    );

                }
            );


    container.innerHTML = "";


    if (
        dayExpenses.length === 0
    ) {

        container.innerHTML =
            '<div class="empty-state">Δεν υπάρχουν πληρωμές για αυτή την ημέρα.</div>';

        renderDaySummary(
            []
        );

        return;
    }


    dayExpenses.forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "expense-item";


            let details = "";


            if (item.category) {

                details +=
                    "<div>Κατηγορία: " +
                    escapeHTML(
                        item.category
                    ) +
                    "</div>";

            }


            if (item.subcategory) {

                details +=
                    "<div>Υποκατηγορία: " +
                    escapeHTML(
                        item.subcategory
                    ) +
                    "</div>";

            }


            if (item.vehicle) {

                details +=
                    "<div>Όχημα: " +
                    escapeHTML(
                        item.vehicle
                    ) +
                    "</div>";

            }


            if (
                item.vehicleExpenseType
            ) {

                details +=
                    "<div>Δαπάνη: " +
                    escapeHTML(
                        item.vehicleExpenseType
                    ) +
                    "</div>";

            }


            if (
                item.odometer !== null &&
                item.odometer !== undefined &&
                item.odometer !== ""
            ) {

                details +=
                    "<div>Κοντέρ: " +
                    number(
                        item.odometer
                    ) +
                    " km</div>";

            }


            if (item.person) {

                details +=
                    "<div>Για: " +
                    escapeHTML(
                        item.person
                    ) +
                    "</div>";

            }


            if (
                item.paymentMethod
            ) {

                details +=
                    "<div>Πληρωμή: " +
                    escapeHTML(
                        item.paymentMethod
                    ) +
                    "</div>";

            }


            if (item.shop) {

                details +=
                    "<div>Κατάστημα: " +
                    escapeHTML(
                        item.shop
                    ) +
                    "</div>";

            }


            if (item.description) {

                details +=
                    "<div>" +
                    escapeHTML(
                        item.description
                    ) +
                    "</div>";

            }


            div.innerHTML = `

                <div class="expense-main">

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.time || ""
                            )}
                        </strong>

                        <div class="expense-details">
                            ${details}
                        </div>

                    </div>

                    <div class="expense-amount">
                        ${money(item.amount)}
                    </div>

                </div>

                <div class="expense-actions">

                    <button
                        type="button"
                        class="secondary"
                        data-edit="${escapeHTML(item.id)}">

                        Επεξεργασία

                    </button>

                    <button
                        type="button"
                        class="danger"
                        data-delete="${escapeHTML(item.id)}">

                        Διαγραφή

                    </button>

                </div>
            `;


            container.appendChild(
                div
            );

        }
    );


    renderDaySummary(
        dayExpenses
    );
    renderTopDailyBalance();
}


/* =========================================================
   DAY SUMMARY
   ========================================================= */

function renderDaySummary(
    dayExpenses
) {

    const container =
        $("daySummary");

    if (!container) {
        return;
    }

    const total =
        dayExpenses.reduce(
            function(sum, item) {

                return (
                    sum +
                    Number(
                        item.amount || 0
                    )
                );

            },
            0
        );


    /* =====================================================
       ΗΜΕΡΗΣΙΟ ΟΡΙΟ
       ===================================================== */

    const dailyLimit =
        Number(
            settings.dailyLimit || 33
        );


    let limitMessage = "";
    let limitClass = "";


    if (dailyLimit > 0) {

        const difference =
            dailyLimit - total;


        if (difference > 0) {

            limitMessage =
    `Υπολείπονται <strong>${money(difference)}</strong> ` +
    `από το όριο των <strong>${money(dailyLimit)}</strong>`;

            limitClass =
                "limit-ok";

        } else if (difference === 0) {

            limitMessage =
                "Το ημερήσιο όριο εξαντλήθηκε";

            limitClass =
                "limit-achieved";

        } else {

            limitMessage =
    `Υπέρβαση ορίου: <strong>${money(
        Math.abs(difference)
    )}</strong>`;

            limitClass =
                "limit-exceeded";
        }
    }

    /* =====================================================
       ΗΜΕΡΗΣΙΟ ΥΠΟΛΟΙΠΟ
       ===================================================== */

    const dailyBalance =
        $("dailyBalance");

    if (dailyBalance && dailyLimit > 0) {

        const balanceDifference =
            dailyLimit - total;


        if (balanceDifference > 0) {

            dailyBalance.className =
                "daily-balance limit-ok";

            dailyBalance.innerHTML =
                `Ημερήσιο υπόλοιπο: <strong>${money(
                    balanceDifference
                )}</strong>`;

        } else if (balanceDifference === 0) {

            dailyBalance.className =
                "daily-balance limit-achieved";

            dailyBalance.innerHTML =
                `Ημερήσιο όριο εξαντλήθηκε`;

        } else {

            dailyBalance.className =
                "daily-balance limit-exceeded";

            dailyBalance.innerHTML =
                `Ημερήσιο όριο ξεπεράστηκε κατά <strong>${money(
                    Math.abs(balanceDifference)
                )}</strong>`;
        }
    }

    /* =====================================================
       ΜΕΣΟΣ ΟΡΟΣ ΗΜΕΡΗΣΙΑΣ ΔΑΠΑΝΗΣ
       ===================================================== */

    const recordedExpenses =
        Array.isArray(expenses)
            ? expenses
            : [];


    const recordedDays =
        new Set(
            recordedExpenses
                .filter(function(item) {

                    return (
                        item &&
                        item.date
                    );

                })
                .map(function(item) {

                    return item.date;

                })
        );


    let averageDaily = 0;


    if (recordedDays.size > 0) {

        const allExpensesTotal =
            recordedExpenses.reduce(
                function(sum, item) {

                    return (
                        sum +
                        Number(
                            item.amount || 0
                        )
                    );

                },
                0
            );


        averageDaily =
            allExpensesTotal /
            recordedDays.size;
    }


    let averageMessage = "";
let averageClass = "";


if (dailyLimit > 0 && recordedDays.size > 0) {

    const averageDifference =
        dailyLimit - averageDaily;


    if (averageDifference > 0) {

        averageMessage =
            `Μέσος όρος: <strong>${money(
                averageDaily
            )}/ημέρα</strong>` +
            `<br>` +
            `Υπολείπονται <strong>${money(
                averageDifference
            )}</strong>`;

        averageClass =
            "limit-ok";


    } else if (
        averageDifference === 0
    ) {

        averageMessage =
            `Μέσος όρος: <strong>${money(
                averageDaily
            )}/ημέρα</strong>`;

        averageClass =
            "limit-achieved";


    } else {

        averageMessage =
            `Μέσος όρος: <strong>${money(
                averageDaily
            )}/ημέρα</strong>` +
            `<br>` +
            `Μέση ημερήσια υπέρβαση: <strong>${money(
                Math.abs(averageDifference)
            )}</strong>`;

        averageClass =
            "limit-exceeded";
    }
}
    


    container.innerHTML = `

        <div class="summary">

            <div class="summary-box">

                <span>
                    Πληρωμές
                </span>

                <strong>
                    ${dayExpenses.length}
                </strong>

            </div>


            <div class="summary-box">

                <span>
                    Σύνολο ημέρας
                </span>

                <strong>
                    ${money(total)}
                </strong>

            </div>

        </div>


        ${
            dailyLimit > 0
                ? `
                    <div class="limit-summary ${limitClass}">

                        <span>
                            ${limitMessage}
                        </span>

                    </div>
                  `
                : ""
        }


        ${
            averageMessage
                ? `
                    <div class="limit-summary ${averageClass}">

                        <span>
                            ${averageMessage}
                        </span>

                    </div>
                  `
                : ""
        }
    `;
}

/* =========================================================
   EDIT
   ========================================================= */

function editExpense(id) {

    const item =
        expenses.find(
            function(expense) {

                return (
                    expense.id === id
                );

            }
        );


    if (!item) {
        return;
    }


    editingExpenseId =
        id;


    $("selectedDate").value =
        item.date || today();


    $("amount").value =
        item.amount;

const editDateTimeWrap =
    $("editDateTimeWrap");

if (editDateTimeWrap) {
    editDateTimeWrap.classList.remove("hidden");
}

if ($("editExpenseDate")) {
    $("editExpenseDate").value =
        item.date || today();
}

if ($("editExpenseTime")) {
    $("editExpenseTime").value =
        item.time || nowTime();
}

    $("paymentMethod").value =
        item.paymentMethod || "Κάρτα";


    $("category").value =
        item.category || "";


    updateCategoryInterface();


    if ($("subcategory")) {

        $("subcategory").value =
            item.subcategory || "";

    }


    if ($("vehicleType")) {

        $("vehicleType").value =
            item.vehicleType || "";

    }


    updateVehicleInterface();


    if ($("vehicle")) {

        $("vehicle").value =
            item.vehicleId || "";

    }


    updateVehicleInterface();


    if ($("vehicleExpenseType")) {

        $("vehicleExpenseType").value =
            item.vehicleExpenseType || "";

    }


    if ($("odometer")) {

        $("odometer").value =
            item.odometer ?? "";

    }


    if ($("person")) {

        $("person").value =
            item.person || "Εμένα";

    }


    if ($("purchaseMethod")) {

        $("purchaseMethod").value =
            item.purchaseMethod || "store";

    }


    if ($("shop")) {

        $("shop").value =
            item.shop || "";

    }


    if ($("orderNumber")) {

        $("orderNumber").value =
            item.orderNumber || "";

    }


    if ($("orderStatus")) {

        $("orderStatus").value =
            item.orderStatus ||
            "Παραγγέλθηκε";

    }


    if ($("description")) {

        $("description").value =
            item.description || "";

    }


    updatePurchaseInterface();


    $("addExpenseButton").innerHTML =
        '<span class="button-plus" aria-hidden="true">+</span>Αποθήκευση αλλαγών';


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );
}


/* =========================================================
   DELETE
   ========================================================= */

function deleteExpense(id) {

    const item =
        expenses.find(
            function(expense) {

                return (
                    expense.id === id
                );

            }
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            "Να διαγραφεί αυτή η πληρωμή;"
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            function(expense) {

                return (
                    expense.id !== id
                );

            }
        );


    saveExpenses();

    renderExpenses();
}


/* =========================================================
   REPORT PERIOD
   ========================================================= */

function getReportDates() {

    const type =
        $("reportType").value;


    const selected =
        $("selectedDate").value ||
        today();


    if (
        type === "custom"
    ) {

        return {

            start:
                $("reportStartDate")
                    .value ||
                selected,

            end:
                $("reportEndDate")
                    .value ||
                selected

        };

    }


    const date =
        new Date(
            selected +
            "T00:00:00"
        );


    let start =
        new Date(date);


    let end =
        new Date(date);


    if (type === "week") {

        const day =
            date.getDay() || 7;


        start.setDate(
            date.getDate() -
            day +
            1
        );


        end =
            new Date(start);


        end.setDate(
            start.getDate() +
            6
        );

    }


    if (type === "month") {

        start =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );


        end =
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );

    }


    if (type === "year") {

        start =
            new Date(
                date.getFullYear(),
                0,
                1
            );


        end =
            new Date(
                date.getFullYear(),
                11,
                31
            );

    }


    function iso(d) {

        return (
            d.getFullYear() +
            "-" +
            String(
                d.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                d.getDate()
            ).padStart(2, "0")
        );

    }


    return {

        start:
            iso(start),

        end:
            iso(end)

    };
}


/* =========================================================
   REPORT FILTER
   ========================================================= */

function getFilteredExpenses() {

    const dates =
        getReportDates();


    const category =
        $("reportCategory")
            .value;


    const vehicle =
        $("reportVehicle")
            ? $("reportVehicle").value
            : "all";


    const vehicleExpense =
        $("reportVehicleExpense")
            ? $("reportVehicleExpense").value
            : "all";


    const person =
        $("reportPerson")
            .value;


    const payment =
        $("reportPayment")
            .value;


    return expenses.filter(
        function(item) {

            if (
                item.date < dates.start ||
                item.date > dates.end
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
                item.vehicleExpenseType !==
                    vehicleExpense
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
   REPORT CALCULATIONS
   ========================================================= */

function groupTotal(
    list,
    property
) {

    const result = {};


    list.forEach(
        function(item) {

            const key =
                item[property] ||
                "Χωρίς επιλογή";


            result[key] =
                (
                    result[key] || 0
                ) +
                Number(
                    item.amount || 0
                );

        }
    );


    return result;
}


function calculateVehicleCostPerKm(
    list
) {

    const byVehicle = {};


    list.forEach(
        function(item) {

            if (
                !item.vehicleId ||
                item.odometer === null ||
                item.odometer === undefined ||
                item.odometer === ""
            ) {

                return;

            }


            if (
                !byVehicle[
                    item.vehicleId
                ]
            ) {

                byVehicle[
                    item.vehicleId
                ] = [];

            }


            byVehicle[
                item.vehicleId
            ].push(item);

        }
    );


    const result = [];


    Object.keys(
        byVehicle
    ).forEach(
        function(vehicleId) {

            const records =
                byVehicle[
                    vehicleId
                ].sort(
                    function(a, b) {

                        return (
                            Number(
                                a.odometer
                            ) -
                            Number(
                                b.odometer
                            )
                        );

                    }
                );


            if (
                records.length < 2
            ) {

                return;

            }


            const first =
                Number(
                    records[0].odometer
                );


            const last =
                Number(
                    records[
                        records.length - 1
                    ].odometer
                );


            const km =
                last - first;


            if (km <= 0) {
                return;
            }


            const total =
                records.reduce(
                    function(sum, item) {

                        return (
                            sum +
                            Number(
                                item.amount ||
                                0
                            )
                        );

                    },
                    0
                );


            result.push({

                vehicleId:
                    vehicleId,

                vehicle:
                    records[0].vehicle ||
                    "Όχημα",

                firstOdometer:
                    first,

                lastOdometer:
                    last,

                kilometers:
                    km,

                total:
                    total,

                costPerKm:
                    total / km

            });

        }
    );


    return result;
}


/* =========================================================
   REPORT HTML
   ========================================================= */

function createReportHTML(
    list
) {

    const showPayments =
        $("reportShowPayments")
            .checked;


    const showCategories =
        $("reportShowCategories")
            .checked;


    const showSubcategories =
        $("reportShowSubcategories")
            .checked;


    const showVehicles =
        $("reportShowVehicles")
            .checked;


    const showOdometer =
        $("reportShowOdometer")
            .checked;


    const showCostPerKm =
        $("reportShowCostPerKm")
            .checked;


    const showTotalVehicleCost =
        $("reportShowTotalVehicleCost")
            .checked;


    const category =
        $("reportCategory")
            .value;


    const dates =
        getReportDates();


    const total =
        list.reduce(
            function(sum, item) {

                return (
                    sum +
                    Number(
                        item.amount || 0
                    )
                );

            },
            0
        );


    let html = `

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Daily Expenses Report
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 30px;
                    color: #111827;
                }

                h1 {
                    text-align: center;
                }

                h2 {
                    margin-top: 30px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 12px;
                }

                th,
                td {
                    border: 1px solid #d1d5db;
                    padding: 7px;
                    text-align: left;
                }

                th {
                    background: #f3f4f6;
                }

                .total {
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 20px;
                }

            </style>

        </head>

        <body>

            <h1>
                Daily Expenses
            </h1>

            <p>
                Περίοδος:
                ${formatDate(
                    dates.start
                )}
                -
                ${formatDate(
                    dates.end
                )}
            </p>

            <p>
                Κατηγορία:
                ${
                    category === "all"
                        ? "Όλες"
                        : escapeHTML(
                            category
                        )
                }
            </p>

            <p class="total">
                Σύνολο:
                ${money(total)}
            </p>
    `;


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
                            Κατηγορία
                        </th>

                        <th>
                            Υποκατηγορία
                        </th>

                        <th>
                            Για ποιον
                        </th>

                        <th>
                            Πληρωμή
                        </th>

                        <th>
                            Όχημα
                        </th>

                        <th>
                            Δαπάνη
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
        `;


        list.forEach(
            function(item) {

                html += `

                    <tr>

                        <td>
                            ${formatDate(
                                item.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.time
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.category
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.subcategory
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.person
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.paymentMethod
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.vehicle
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.vehicleExpenseType
                            )}
                        </td>

                        <td>
                            ${
                                item.odometer !== null &&
                                item.odometer !== undefined
                                    ? number(
                                        item.odometer
                                    ) + " km"
                                    : ""
                            }
                        </td>

                        <td>
                            ${money(
                                item.amount
                            )}
                        </td>

                    </tr>
                `;

            }
        );


        html += `

                </tbody>

            </table>
        `;
    }


    if (showCategories) {

        const groups =
            groupTotal(
                list,
                "category"
            );


        html += `

            <h2>
                Σύνολα ανά κατηγορία
            </h2>

            <table>

                <thead>

                    <tr>
                        <th>Κατηγορία</th>
                        <th>Σύνολο</th>
                    </tr>

                </thead>

                <tbody>
        `;


        Object.keys(groups)
            .forEach(
                function(key) {

                    html += `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    key
                                )}
                            </td>

                            <td>
                                ${money(
                                    groups[key]
                                )}
                            </td>

                        </tr>
                    `;

                }
            );


        html += `

                </tbody>

            </table>
        `;
    }


    if (showSubcategories) {

        const groups = {};


        list.forEach(
            function(item) {

                const key =
                    item.subcategory ||
                    item.vehicleExpenseType ||
                    "Χωρίς υποκατηγορία";


                groups[key] =
                    (
                        groups[key] ||
                        0
                    ) +
                    Number(
                        item.amount || 0
                    );

            }
        );


        html += `

            <h2>
                Σύνολα ανά υποκατηγορία
            </h2>

            <table>

                <thead>

                    <tr>
                        <th>Υποκατηγορία</th>
                        <th>Σύνολο</th>
                    </tr>

                </thead>

                <tbody>
        `;


        Object.keys(groups)
            .forEach(
                function(key) {

                    html += `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    key
                                )}
                            </td>

                            <td>
                                ${money(
                                    groups[key]
                                )}
                            </td>

                        </tr>
                    `;

                }
            );


        html += `

                </tbody>

            </table>
        `;
    }


    if (
        category === "Οχήματα" &&
        showVehicles
    ) {

        const groups =
            groupTotal(
                list,
                "vehicle"
            );


        html += `

            <h2>
                Σύνολα ανά όχημα
            </h2>

            <table>

                <thead>

                    <tr>
                        <th>Όχημα</th>
                        <th>Σύνολο</th>
                    </tr>

                </thead>

                <tbody>
        `;


        Object.keys(groups)
            .forEach(
                function(key) {

                    html += `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    key
                                )}
                            </td>

                            <td>
                                ${money(
                                    groups[key]
                                )}
                            </td>

                        </tr>
                    `;

                }
            );


        html += `

                </tbody>

            </table>
        `;
    }


    if (
        category === "Οχήματα" &&
        showOdometer
    ) {

        const records =
            list.filter(
                function(item) {

                    return (
                        item.odometer !== null &&
                        item.odometer !== undefined &&
                        item.odometer !== ""
                    );

                }
            );


        html += `

            <h2>
                Χιλιόμετρα / κοντέρ
            </h2>

            <table>

                <thead>

                    <tr>
                        <th>Ημερομηνία</th>
                        <th>Όχημα</th>
                        <th>Κοντέρ</th>
                    </tr>

                </thead>

                <tbody>
        `;


        records.forEach(
            function(item) {

                html += `

                    <tr>

                        <td>
                            ${formatDate(
                                item.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.vehicle
                            )}
                        </td>

                        <td>
                            ${number(
                                item.odometer
                            )} km
                        </td>

                    </tr>
                `;

            }
        );


        html += `

                </tbody>

            </table>
        `;
    }


    if (
        category === "Οχήματα" &&
        (
            showCostPerKm ||
            showTotalVehicleCost
        )
    ) {

        const calculations =
            calculateVehicleCostPerKm(
                list
            );


        html += `

            <h2>
                Κόστος οχήματος ανά χιλιόμετρο
            </h2>

            <table>

                <thead>

                    <tr>

                        <th>
                            Όχημα
                        </th>

                        <th>
                            Αρχικό κοντέρ
                        </th>

                        <th>
                            Τελικό κοντέρ
                        </th>

                        <th>
                            Χιλιόμετρα
                        </th>

                        <th>
                            Συνολικό κόστος
                        </th>

                        <th>
                            Κόστος / km
                        </th>

                    </tr>

                </thead>

                <tbody>
        `;


        calculations.forEach(
            function(item) {

                html += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                item.vehicle
                            )}
                        </td>

                        <td>
                            ${number(
                                item.firstOdometer
                            )}
                        </td>

                        <td>
                            ${number(
                                item.lastOdometer
                            )}
                        </td>

                        <td>
                            ${number(
                                item.kilometers
                            )}
                        </td>

                        <td>
                            ${money(
                                item.total
                            )}
                        </td>

                        <td>
                            ${money(
                                item.costPerKm
                            )}
                        </td>

                    </tr>
                `;

            }
        );


        html += `

                </tbody>

            </table>
        `;
    }


    html += `

        </body>

        </html>
    `;


    return html;
}


/* =========================================================
   GENERATE REPORT
   ========================================================= */

function generateReport() {

    const list =
        getFilteredExpenses();


    if (list.length === 0) {

        showMessage(
            "Δεν υπάρχουν πληρωμές για τα επιλεγμένα κριτήρια."
        );

        return;
    }


    const html =
        createReportHTML(
            list
        );


    const blob =
        new Blob(
            [html],
            {
                type:
                    "text/html;charset=utf-8"
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


    link.href = url;

    link.download =
        "daily-expenses-report.html";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   SETTINGS RENDER
   ========================================================= */

function renderSettings() {
    
    if ($("dailyLimit")) {
    $("dailyLimit").value =
        settings.dailyLimit ?? 33;
}

    renderSimpleSettings(
        "categorySettings",
        settings.categories,
        "category"
    );


    renderSimpleSettings(
        "subcategorySettings",
        settings.shoppingSubcategories,
        "subcategory"
    );


    renderSimpleSettings(
        "paymentSettings",
        settings.paymentMethods,
        "payment"
    );


    renderSimpleSettings(
        "personSettings",
        settings.persons,
        "person"
    );


    renderVehicleSettings();
}


/* =========================================================
   SIMPLE SETTINGS
   ========================================================= */

function renderSimpleSettings(
    containerId,
    values,
    type
) {

    const container =
        $(containerId);


    if (!container) {
        return;
    }


    container.innerHTML = "";


    values.forEach(
        function(value, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "setting-item";


            const input =
                document.createElement(
                    "input"
                );


            input.type = "text";

            input.value = value;


            input.addEventListener(
                "change",
                function() {

                    const newValue =
                        input.value.trim();


                    if (!newValue) {

                        input.value =
                            values[index];

                        return;

                    }


                    values[index] =
                        newValue;


                    saveSettings();

                    populateMainSelects();

                    renderSettings();

                }
            );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";

            deleteButton.className =
                "danger";

            deleteButton.textContent =
                "Διαγραφή";


            deleteButton.addEventListener(
                "click",
                function() {

                    if (
                        !confirm(
                            "Να διαγραφεί η επιλογή;"
                        )
                    ) {

                        return;

                    }


                    values.splice(
                        index,
                        1
                    );


                    saveSettings();

                    populateMainSelects();

                    renderSettings();

                }
            );


            row.appendChild(
                input
            );

            row.appendChild(
                deleteButton
            );


            container.appendChild(
                row
            );

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
        function(vehicle) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "vehicle-setting";


            const info =
                document.createElement(
                    "div"
                );


            info.innerHTML = `

                <strong>
                    ${escapeHTML(
                        vehicleDisplayName(
                            vehicle
                        )
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        vehicle.type
                    )}
                </small>
            `;


            const edit =
                document.createElement(
                    "button"
                );


            edit.type =
                "button";

            edit.className =
                "secondary";

            edit.textContent =
                "Επεξεργασία";


            edit.addEventListener(
                "click",
                function() {

                    const make =
                        prompt(
                            "Μάρκα:",
                            vehicle.make
                        );


                    if (
                        make === null
                    ) {
                        return;
                    }


                    const model =
                        prompt(
                            "Μοντέλο / Τύπος:",
                            vehicle.model
                        );


                    if (
                        model === null
                    ) {
                        return;
                    }


                    const plate =
                        prompt(
                            "Πινακίδα:",
                            vehicle.plate
                        );


                    if (
                        plate === null
                    ) {
                        return;
                    }


                    vehicle.make =
                        make.trim();

                    vehicle.model =
                        model.trim();

                    vehicle.plate =
                        plate.trim();


                    saveSettings();

                    populateMainSelects();

                    renderSettings();

                }
            );


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";

            remove.className =
                "danger";

            remove.textContent =
                "Διαγραφή";


            remove.addEventListener(
                "click",
                function() {

                    if (
                        !confirm(
                            "Να διαγραφεί το όχημα;"
                        )
                    ) {

                        return;

                    }


                    settings.vehicles =
                        settings.vehicles.filter(
                            function(item) {

                                return (
                                    item.id !==
                                    vehicle.id
                                );

                            }
                        );


                    saveSettings();

                    populateMainSelects();

                    renderSettings();

                }
            );


            row.appendChild(
                info
            );

            row.appendChild(
                edit
            );

            row.appendChild(
                remove
            );


            container.appendChild(
                row
            );

        }
    );
}


/* =========================================================
   ADD SETTINGS
   ========================================================= */

function addSimpleSetting(
    inputId,
    array
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
        !array.includes(
            value
        )
    ) {

        array.push(
            value
        );

    }


    input.value = "";

    saveSettings();

    populateMainSelects();

    renderSettings();
}


/* =========================================================
   ADD VEHICLE
   ========================================================= */

function addVehicle() {

    const type =
        $("newVehicleType")
            .value;


    const make =
        $("newVehicleMake")
            .value
            .trim();


    const model =
        $("newVehicleModel")
            .value
            .trim();


    const plate =
        $("newVehiclePlate")
            .value
            .trim();


    if (
        !make &&
        !model &&
        !plate
    ) {

        showMessage(
            "Συμπλήρωσε τουλάχιστον ένα στοιχείο του οχήματος."
        );

        return;
    }


    settings.vehicles.push({

        id:
            createId(
                "vehicle"
            ),

        type:
            type,

        make:
            make,

        model:
            model,

        plate:
            plate

    });


    $("newVehicleMake").value =
        "";

    $("newVehicleModel").value =
        "";

    $("newVehiclePlate").value =
        "";


    saveSettings();

    populateMainSelects();

    renderSettings();
}


/* =========================================================
   SETTINGS MODAL
   ========================================================= */

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


    modal.classList.add(
        "hidden"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   EXPORT
   ========================================================= */

function exportData() {

    const data = {

        version: 4,

        exportedAt:
            new Date()
                .toISOString(),

        expenses:
            expenses,

        settings:
            settings

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


    link.href = url;

    link.download =
        "daily-expenses-backup.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );
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

                renderExpenses();


                showMessage(
                    "Τα δεδομένα εισήχθησαν επιτυχώς."
                );

            } catch (error) {

                console.error(
                    error
                );


                showMessage(
                    "Το αρχείο δεν είναι έγκυρο."
                );

            }

        };


    reader.readAsText(
        file
    );
}


/* =========================================================
   RESET SETTINGS
   ========================================================= */

function resetSettings() {

    if (
        !confirm(
            "Να γίνει επαναφορά των ρυθμίσεων στις αρχικές τιμές;"
        )
    ) {

        return;
    }


    settings =
        clone(
            DEFAULT_SETTINGS
        );


    saveSettings();

    populateMainSelects();

    renderSettings();


    showMessage(
        "Οι ρυθμίσεις επαναφέρθηκαν."
    );
}


/* =========================================================
   OPTIONAL LOCATION
   ========================================================= */

function getCurrentLocation() {

    if (
        !navigator.geolocation
    ) {

        return Promise.resolve(
            null
        );

    }


    return new Promise(
        function(resolve) {

            navigator.geolocation.getCurrentPosition(

                function(position) {

                    resolve({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    });

                },

                function() {

                    /*
                     * Η τοποθεσία είναι
                     * ΠΡΟΑΙΡΕΤΙΚΗ.
                     *
                     * Αν το Safari δεν δώσει
                     * άδεια, η πληρωμή
                     * συνεχίζει κανονικά.
                     */

                    resolve(
                        null
                    );

                },

                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        5000,

                    maximumAge:
                        60000

                }

            );

        }
    );
}


/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {


    /* ΝΕΑ ΠΛΗΡΩΜΗ */

    $("addExpenseButton")
        ?.addEventListener(
            "click",
            saveExpense
        );


    /* ΚΑΤΗΓΟΡΙΑ */

    $("category")
        ?.addEventListener(
            "change",
            updateCategoryInterface
        );


    /* ΤΥΠΟΣ ΟΧΗΜΑΤΟΣ */

    $("vehicleType")
        ?.addEventListener(
            "change",
            function() {

                /*
                 * Καθαρίζουμε τις επόμενες
                 * επιλογές πριν δημιουργήσουμε
                 * τη νέα λίστα.
                 */

                if ($("vehicle")) {

                    $("vehicle").value =
                        "";

                }


                if (
                    $("vehicleExpenseType")
                ) {

                    $(
                        "vehicleExpenseType"
                    ).value = "";

                }


                if ($("odometer")) {

                    $("odometer").value =
                        "";

                }


                updateVehicleInterface();

            }
        );


    /* ΣΥΓΚΕΚΡΙΜΕΝΟ ΟΧΗΜΑ */

    $("vehicle")
        ?.addEventListener(
            "change",
            function() {

                /*
                 * Μόλις επιλεγεί
                 * συγκεκριμένο όχημα,
                 * εμφανίζεται το επόμενο
                 * βήμα: Είδος δαπάνης.
                 */

                updateVehicleInterface();

            }
        );


    /* ΤΡΟΠΟΣ ΑΓΟΡΑΣ */

    $("purchaseMethod")
        ?.addEventListener(
            "change",
            updatePurchaseInterface
        );


    /* ΗΜΕΡΟΜΗΝΙΑ */

    $("selectedDate")
        ?.addEventListener(
            "change",
            renderExpenses
        );


    /* REPORT CATEGORY */

    $("reportCategory")
        ?.addEventListener(
            "change",
            updateReportInterface
        );


    /* REPORT TYPE */

    $("reportType")
        ?.addEventListener(
            "change",
            function() {

                const custom =
                    $("reportType")
                        .value ===
                    "custom";


                toggle(
                    "reportStartDate",
                    custom
                );

            }
        );


    /* REPORT */

    $("generateReportButton")
        ?.addEventListener(
            "click",
            generateReport
        );



    /* SETTINGS */

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

/* ΗΜΕΡΗΣΙΟ ΟΡΙΟ */

$("dailyLimit")
    ?.addEventListener(
        "change",
        function() {

            saveSettings();

            renderExpenses();

        }
    );

    /* ADD SETTINGS */

    $("addCategory")
        ?.addEventListener(
            "click",
            function() {

                addSimpleSetting(
                    "newCategory",
                    settings.categories
                );

            }
        );


    $("addSubcategory")
        ?.addEventListener(
            "click",
            function() {

                addSimpleSetting(
                    "newSubcategory",
                    settings.shoppingSubcategories
                );

            }
        );


    $("addPayment")
        ?.addEventListener(
            "click",
            function() {

                addSimpleSetting(
                    "newPayment",
                    settings.paymentMethods
                );

            }
        );


    $("addPerson")
        ?.addEventListener(
            "click",
            function() {

                addSimpleSetting(
                    "newPerson",
                    settings.persons
                );

            }
        );


    $("addVehicle")
        ?.addEventListener(
            "click",
            addVehicle
        );


    /* EXPORT */

    $("exportData")
        ?.addEventListener(
            "click",
            exportData
        );


    /* IMPORT */

    $("importDataButton")
        ?.addEventListener(
            "click",
            function() {

                $("importData")
                    ?.click();

            }
        );


    $("importData")
        ?.addEventListener(
            "change",
            function(event) {

                const file =
                    event.target.files[0];

                importData(
                    file
                );

            }
        );


    /* RESET */

    $("resetSettings")
        ?.addEventListener(
            "click",
            resetSettings
        );


    /* EXPENSE LIST */

    $("expenseList")
        ?.addEventListener(
            "click",
            function(event) {

                const editButton =
                    event.target.closest(
                        "[data-edit]"
                    );


                if (editButton) {

                    editExpense(
                        editButton.dataset.edit
                    );

                    return;

                }


                const deleteButton =
                    event.target.closest(
                        "[data-delete]"
                    );


                if (deleteButton) {

                    deleteExpense(
                        deleteButton.dataset.delete
                    );

                }

            }
        );


    /* ESC */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeSettings();

            }

        }
    );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initialize() {

    if ($("selectedDate")) {

        $("selectedDate").value =
            today();

    }


    updateDateTime();


    setInterval(
        updateDateTime,
        30000
    );


    populateMainSelects();


    setupEvents();


    renderExpenses();

renderTopDailyBalance();

    updatePurchaseInterface();


    updateCategoryInterface();


    updateReportInterface();
}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);