// ============================================================
// DAILY EXPENSES
// COMPLETE APP.JS
// ============================================================

const STORAGE_KEY = "dailyExpensesV2";
const SETTINGS_KEY = "dailyExpensesSettingsV2";


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const defaultSettings = {

    payments: [
        { name: "Κάρτα", icon: "💳" },
        { name: "Μετρητά", icon: "💶" },
        { name: "IRIS", icon: "📱" },
        { name: "Τραπεζικός λογαριασμός", icon: "🏦" }
    ],

    categories: [
        { name: "Βενζίνη", icon: "⛽" },
        { name: "Φαγητό", icon: "🍽️" },
        { name: "Εισιτήρια", icon: "🎫" },
        { name: "Καφέ", icon: "☕" },
        { name: "Αγορές", icon: "🛒" },
        { name: "Συντήρηση οχήματος", icon: "🔧" },
        { name: "Διάφορα", icon: "📦" }
    ],

    persons: [
        { name: "Εμένα", icon: "👤" },
        { name: "Οικογένεια", icon: "👨‍👩‍👧‍👦" },
        { name: "Άλλος", icon: "👥" }
    ],

    purchaseMethods: [
        { name: "Φυσικό κατάστημα", icon: "🏪" },
        { name: "Internet", icon: "🌐" }
    ],

    internetOrigins: [
        { name: "Ελλάδα", icon: "🇬🇷" },
        { name: "Εξωτερικό", icon: "🌍" }
    ],

    subcategories: [
        { name: "Super Market", icon: "🛒" },
        { name: "Ηλεκτρονικά", icon: "💻" },
        { name: "Ρούχα", icon: "👕" },
        { name: "Σπίτι", icon: "🏠" },
        { name: "Αυτοκίνητο", icon: "🚗" },
        { name: "Διάφορες αγορές", icon: "🛍️" },
        { name: "Άλλο", icon: "📦" }
    ],

    vehicles: []

};


// ============================================================
// BASIC HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function loadJSON(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (value) {
            return JSON.parse(value);
        }

    } catch (error) {

        console.error(
            "Error loading data:",
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

    return String(number).padStart(2, "0");

}


function getToday() {

    const d = new Date();

    return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate())
    );

}


function getCurrentTime() {

    const d = new Date();

    return (
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes())
    );

}


function formatDate(value) {

    if (!value) return "";

    const p = value.split("-");

    if (p.length !== 3) return value;

    return (
        p[2] +
        "/" +
        p[1] +
        "/" +
        p[0]
    );

}


function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString(
            "el-GR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) + " €";

}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;

}


// ============================================================
// DATA
// ============================================================

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


// ============================================================
// SETTINGS MIGRATION
// ============================================================

function normalizeOption(item, defaultIcon = "🔹") {

    if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
    ) {

        return {
            name:
                String(
                    item.name || ""
                ),

            icon:
                String(
                    item.icon ||
                    defaultIcon
                )
        };

    }


    return {

        name:
            String(
                item || ""
            ),

        icon:
            defaultIcon

    };

}


function normalizeList(
    list,
    defaultIcon
) {

    if (!Array.isArray(list)) {
        return [];
    }

    return list
        .map(
            item =>
                normalizeOption(
                    item,
                    defaultIcon
                )
        )
        .filter(
            item =>
                item.name.trim() !== ""
        );

}


function migrateSettings() {

    settings.payments =
        normalizeList(
            settings.payments,
            "💳"
        );

    settings.categories =
        normalizeList(
            settings.categories,
            "🏷️"
        );

    settings.persons =
        normalizeList(
            settings.persons,
            "👤"
        );

    settings.purchaseMethods =
        normalizeList(
            settings.purchaseMethods,
            "🛒"
        );

    settings.internetOrigins =
        normalizeList(
            settings.internetOrigins,
            "🌍"
        );

    settings.subcategories =
        normalizeList(
            settings.subcategories,
            "📦"
        );


    if (!Array.isArray(settings.vehicles)) {
        settings.vehicles = [];
    }


    settings.vehicles =
        settings.vehicles.map(
            vehicle => {

                if (
                    typeof vehicle === "string"
                ) {

                    return {

                        id:
                            "vehicle-" +
                            Date.now() +
                            "-" +
                            Math.random(),

                        type:
                            vehicle === "Μηχανή"
                                ? "Μηχανή"
                                : "Αυτοκίνητο",

                        make:
                            vehicle === "Αυτοκίνητο" ||
                            vehicle === "Μηχανή"
                                ? ""
                                : vehicle,

                        model:
                            "",

                        plate:
                            "",

                        icon:
                            vehicle === "Μηχανή"
                                ? "🏍️"
                                : "🚗"

                    };

                }


                return {

                    id:
                        vehicle.id ||
                        (
                            "vehicle-" +
                            Date.now() +
                            "-" +
                            Math.random()
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
                        "",

                    icon:
                        vehicle.icon ||
                        (
                            vehicle.type === "Μηχανή"
                                ? "🏍️"
                                : "🚗"
                        )

                };

            }
        );


    saveSettings();

}


migrateSettings();


// ============================================================
// OPTION HELPERS
// ============================================================

function optionName(item) {

    if (
        item &&
        typeof item === "object"
    ) {

        return item.name || "";

    }

    return String(item || "");

}


function optionIcon(item) {

    if (
        item &&
        typeof item === "object"
    ) {

        return item.icon || "🔹";

    }

    return "🔹";

}


function optionLabel(item) {

    return (
        optionIcon(item) +
        " " +
        optionName(item)
    );

}


function findOption(
    list,
    name
) {

    return list.find(
        item =>
            optionName(item) === name
    );

}


// ============================================================
// VEHICLES
// ============================================================

function vehicleLabel(vehicle) {

    if (!vehicle) return "";

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
            result += " — ";
        }

        result +=
            vehicle.plate;

    }

    return (
        result ||
        "Όχημα χωρίς στοιχεία"
    );

}


function findVehicle(id) {

    return settings.vehicles.find(
        vehicle =>
            String(vehicle.id) ===
            String(id)
    );

}


// ============================================================
// SELECT HELPERS
// ============================================================

function clearSelect(select) {

    if (select) {
        select.innerHTML = "";
    }

}


function addPlaceholder(
    select,
    text
) {

    const option =
        document.createElement(
            "option"
        );

    option.value = "";

    option.textContent = text;

    option.selected = true;

    select.appendChild(option);

}


function fillOptionSelect(
    select,
    list,
    placeholder = null,
    allText = null
) {

    if (!select) return;

    clearSelect(select);


    if (placeholder !== null) {

        addPlaceholder(
            select,
            placeholder
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


    list.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                optionName(item);

            option.textContent =
                optionLabel(item);

            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// VEHICLE TYPE SELECT
// ============================================================

function ensureVehicleTypeSelect() {

    const vehicle =
        $("vehicle");

    if (!vehicle) return null;


    let typeSelect =
        $("vehicleType");


    if (typeSelect) {
        return typeSelect;
    }


    typeSelect =
        document.createElement(
            "select"
        );

    typeSelect.id =
        "vehicleType";


    const empty =
        document.createElement(
            "option"
        );

    empty.value = "";

    empty.textContent =
        "🚘 Επιλέξτε τύπο οχήματος";

    empty.selected = true;

    typeSelect.appendChild(
        empty
    );


    const car =
        document.createElement(
            "option"
        );

    car.value =
        "Αυτοκίνητο";

    car.textContent =
        "🚗 Αυτοκίνητο";

    typeSelect.appendChild(
        car
    );


    const motorcycle =
        document.createElement(
            "option"
        );

    motorcycle.value =
        "Μηχανή";

    motorcycle.textContent =
        "🏍️ Μηχανή";

    typeSelect.appendChild(
        motorcycle
    );


    const parent =
        vehicle.parentElement;


    if (parent) {

        parent.insertBefore(
            typeSelect,
            vehicle
        );

    }


    typeSelect.addEventListener(
        "change",
        updateVehicleSelection
    );


    return typeSelect;

}


// ============================================================
// VEHICLE SELECTION
// ============================================================

function updateVehicleSelection() {

    const type =
        $("vehicleType")?.value ||
        "";

    const vehicle =
        $("vehicle");


    if (!vehicle) return;


    clearSelect(vehicle);


    addPlaceholder(
        vehicle,
        type === "Αυτοκίνητο"
            ? "🚗 Επιλέξτε αυτοκίνητο"
            : type === "Μηχανή"
                ? "🏍️ Επιλέξτε μηχανή"
                : "🚘 Επιλέξτε όχημα"
    );


    if (!type) {

        return;

    }


    settings.vehicles
        .filter(
            item =>
                item.type === type
        )
        .forEach(
            item => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item.id;

                option.textContent =
                    (
                        item.icon ||
                        (
                            type === "Μηχανή"
                                ? "🏍️"
                                : "🚗"
                        )
                    ) +
                    " " +
                    vehicleLabel(item);

                vehicle.appendChild(
                    option
                );

            }
        );

}


// ============================================================
// PURCHASE METHOD
// ============================================================

function setupPurchaseMethod() {

    const select =
        $("purchaseMethod");

    if (!select) return;


    clearSelect(select);


    const methods =
        settings.purchaseMethods;


    methods.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            const name =
                optionName(item);


            option.value =
                name ===
                "Φυσικό κατάστημα"
                    ? "store"
                    : name ===
                        "Internet"
                        ? "internet"
                        : name;


            option.textContent =
                optionLabel(item);


            select.appendChild(
                option
            );

        }
    );


    if (
        methods.some(
            item =>
                optionName(item) ===
                "Φυσικό κατάστημα"
        )
    ) {

        select.value =
            "store";

    }


    updateInternetOrigin();

}


// ============================================================
// INTERNET ORIGIN
// ============================================================

function createInternetOriginField() {

    const purchase =
        $("purchaseMethod");

    if (!purchase) return;


    let wrapper =
        $("dynamicInternetOriginWrap");


    if (wrapper) {

        fillOptionSelect(
            $("internetOrigin"),
            settings.internetOrigins,
            "🌍 Επιλέξτε προέλευση"
        );

        return;

    }


    wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "dynamicInternetOriginWrap";


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


    if (
        purchase.parentElement
    ) {

        purchase.parentElement
            .insertBefore(
                wrapper,
                purchase.nextSibling
            );

    }


    fillOptionSelect(
        select,
        settings.internetOrigins,
        "🌍 Επιλέξτε προέλευση"
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
        $("purchaseMethod")?.value ||
        "";


    if (method === "internet") {

        createInternetOriginField();

    } else {

        removeInternetOriginField();

    }

}


// ============================================================
// REFRESH ALL SELECTS
// ============================================================

function refreshSelects() {

    // PAYMENT
    fillOptionSelect(
        $("paymentMethod"),
        settings.payments
    );


    if (
        $("paymentMethod") &&
        settings.payments.some(
            item =>
                optionName(item) ===
                "Κάρτα"
        )
    ) {

        $("paymentMethod").value =
            "Κάρτα";

    }


    // CATEGORY
    fillOptionSelect(
        $("category"),
        settings.categories,
        "🏷️ Επιλέξτε κατηγορία"
    );


    // PERSON
    fillOptionSelect(
        $("person"),
        settings.persons
    );


    if (
        $("person") &&
        settings.persons.some(
            item =>
                optionName(item) ===
                "Εμένα"
        )
    ) {

        $("person").value =
            "Εμένα";

    }


    // PURCHASE
    setupPurchaseMethod();


    // VEHICLE
    const vehicle =
        $("vehicle");


    if (vehicle) {

        ensureVehicleTypeSelect();

        updateVehicleSelection();

    }


    // SUBCATEGORY
    fillOptionSelect(
        $("subcategory"),
        settings.subcategories,
        "📦 Επιλέξτε υποκατηγορία"
    );


    // REPORTS
    fillOptionSelect(
        $("reportCategory"),
        settings.categories,
        null,
        "Όλες"
    );


    fillOptionSelect(
        $("reportPerson"),
        settings.persons,
        null,
        "Όλοι"
    );


    fillOptionSelect(
        $("reportPayment"),
        settings.payments,
        null,
        "Όλοι"
    );


    updateConditionalFields();

}


// ============================================================
// CONDITIONAL FIELDS
// ============================================================

function updateConditionalFields() {

    const category =
        $("category")?.value ||
        "";


    const fuel =
        category === "Βενζίνη";


    const vehicleCategory =
        category === "Βενζίνη" ||
        category ===
        "Συντήρηση οχήματος";


    const shopping =
        category === "Αγορές";


    const method =
        $("purchaseMethod")?.value ||
        "";


    const internet =
        method === "internet";


    $("vehicleWrap")
        ?.classList.toggle(
            "hidden",
            !vehicleCategory
        );


    $("litersWrap")
        ?.classList.toggle(
            "hidden",
            !fuel
        );


    $("odometerWrap")
        ?.classList.toggle(
            "hidden",
            !vehicleCategory
        );


    $("subcategoryWrap")
        ?.classList.toggle(
            "hidden",
            !shopping
        );


    $("orderWrap")
        ?.classList.toggle(
            "hidden",
            !internet
        );


    $("orderStatusWrap")
        ?.classList.toggle(
            "hidden",
            !internet
        );


    updateInternetOrigin();

}


// ============================================================
// ADD EXPENSE
// ============================================================

function addExpense() {

    const amount =
        Number(
            $("amount")?.value ||
            0
        );


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


    const vehicleCategory =
        category === "Βενζίνη" ||
        category ===
        "Συντήρηση οχήματος";


    const fuel =
        category === "Βενζίνη";


    const internet =
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
            internet
                ? (
                    $("internetOrigin")
                        ?.value ||
                    ""
                )
                : "",

        subcategory:
            category === "Αγορές"
                ? (
                    $("subcategory")
                        ?.value ||
                    ""
                )
                : "",

        vehicleType:
            vehicleCategory
                ? (
                    $("vehicleType")
                        ?.value ||
                    ""
                )
                : "",

        vehicleId:
            vehicleCategory
                ? (
                    $("vehicle")
                        ?.value ||
                    ""
                )
                : "",

        liters:
            fuel
                ? Number(
                    $("liters")
                        ?.value ||
                    0
                )
                : 0,

        odometer:
            vehicleCategory
                ? Number(
                    $("odometer")
                        ?.value ||
                    0
                )
                : 0,

        shop:
            $("shop")
                ?.value
                ?.trim() ||
            "",

        orderNumber:
            internet
                ? (
                    $("orderNumber")
                        ?.value
                        ?.trim() ||
                    ""
                )
                : "",

        orderStatus:
            internet
                ? (
                    $("orderStatus")
                        ?.value ||
                    ""
                )
                : "",

        description:
            $("description")
                ?.value
                ?.trim() ||
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


// ============================================================
// CLEAR FORM
// ============================================================

function clearForm() {

    [
        "amount",
        "shop",
        "orderNumber",
        "liters",
        "odometer",
        "description"
    ]
        .forEach(
            id => {

                if ($(id)) {
                    $(id).value = "";
                }

            }
        );


    // CATEGORY EMPTY
    if ($("category")) {

        $("category").selectedIndex =
            0;

    }


    // PERSON = ΕΜΕΝΑ
    if ($("person")) {

        const found =
            settings.persons.find(
                item =>
                    optionName(item) ===
                    "Εμένα"
            );


        if (found) {

            $("person").value =
                "Εμένα";

        }

    }


    // PURCHASE = PHYSICAL STORE
    if ($("purchaseMethod")) {

        $("purchaseMethod").value =
            "store";

    }


    // PAYMENT = CARD
    if ($("paymentMethod")) {

        $("paymentMethod").value =
            "Κάρτα";

    }


    // VEHICLE
    if ($("vehicleType")) {

        $("vehicleType").value =
            "";

    }


    if ($("vehicle")) {

        updateVehicleSelection();

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


// ============================================================
// DELETE EXPENSE
// ============================================================

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Θέλετε να διαγράψετε αυτό το έξοδο;"
        );


    if (!confirmed) return;


    expenses =
        expenses.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveExpenses();


    renderDay(
        $("selectedDate").value
    );

}


// ============================================================
// RENDER DAY
// ============================================================

function renderDay(date) {

    const list =
        expenses
            .filter(
                item =>
                    item.date === date
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(
                        b.time
                    )
            );


    let cardTotal = 0;

    let cashTotal = 0;

    let total = 0;


    list.forEach(
        expense => {

            const amount =
                Number(
                    expense.amount ||
                    0
                );


            total += amount;


            if (
                expense.payment ===
                "Κάρτα"
            ) {

                cardTotal +=
                    amount;

            }


            if (
                expense.payment ===
                "Μετρητά"
            ) {

                cashTotal +=
                    amount;

            }

        }
    );


    if ($("daySummary")) {

        $("daySummary").innerHTML = `

            <div class="summary">

                <div class="summary-box">

                    💳 Κάρτα

                    <strong>
                        ${formatMoney(
                            cardTotal
                        )}
                    </strong>

                </div>


                <div class="summary-box">

                    💶 Μετρητά

                    <strong>
                        ${formatMoney(
                            cashTotal
                        )}
                    </strong>

                </div>


                <div class="summary-box">

                    💰 Σύνολο

                    <strong>
                        ${formatMoney(
                            total
                        )}
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


    if (!$("expenseList")) return;


    $("expenseList").innerHTML =
        list
            .map(
                expense => {

                    let details =
                        escapeHtml(
                            expense.time
                        );


                    if (
                        expense.payment
                    ) {

                        const payment =
                            findOption(
                                settings.payments,
                                expense.payment
                            );


                        details +=
                            " — " +
                            escapeHtml(
                                payment
                                    ? optionLabel(payment)
                                    : expense.payment
                            );

                    }


                    if (
                        expense.category
                    ) {

                        const category =
                            findOption(
                                settings.categories,
                                expense.category
                            );


                        details +=
                            " — " +
                            escapeHtml(
                                category
                                    ? optionLabel(category)
                                    : expense.category
                            );

                    }


                    if (
                        expense.person
                    ) {

                        const person =
                            findOption(
                                settings.persons,
                                expense.person
                            );


                        details +=
                            " — " +
                            escapeHtml(
                                person
                                    ? optionLabel(person)
                                    : expense.person
                            );

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
                                " — " +
                                escapeHtml(
                                    vehicle.icon +
                                    " " +
                                    vehicleLabel(
                                        vehicle
                                    )
                                );

                        }

                    }


                    if (
                        expense.liters
                    ) {

                        details +=
                            ` — ⛽ ${expense.liters} L`;

                    }


                    if (
                        expense.odometer
                    ) {

                        details +=
                            ` — 📏 ${expense.odometer} km`;

                    }


                    if (
                        expense.purchaseMethod
                    ) {

                        let methodText =
                            expense.purchaseMethod;


                        if (
                            expense.purchaseMethod ===
                            "store"
                        ) {

                            methodText =
                                "🏪 Φυσικό κατάστημα";

                        }


                        if (
                            expense.purchaseMethod ===
                            "internet"
                        ) {

                            methodText =
                                "🌐 Internet";

                        }


                        details +=
                            " — " +
                            escapeHtml(
                                methodText
                            );

                    }


                    if (
                        expense.internetOrigin
                    ) {

                        const origin =
                            findOption(
                                settings.internetOrigins,
                                expense.internetOrigin
                            );


                        details +=
                            " — " +
                            escapeHtml(
                                origin
                                    ? optionLabel(origin)
                                    : expense.internetOrigin
                            );

                    }


                    if (
                        expense.shop
                    ) {

                        details +=
                            " — " +
                            escapeHtml(
                                expense.shop
                            );

                    }


                    if (
                        expense.subcategory
                    ) {

                        const sub =
                            findOption(
                                settings.subcategories,
                                expense.subcategory
                            );


                        details +=
                            " — " +
                            escapeHtml(
                                sub
                                    ? optionLabel(sub)
                                    : expense.subcategory
                            );

                    }


                    if (
                        expense.orderNumber
                    ) {

                        details +=
                            " — #" +
                            escapeHtml(
                                expense.orderNumber
                            );

                    }


                    if (
                        expense.description
                    ) {

                        details +=
                            " — " +
                            escapeHtml(
                                expense.description
                            );

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


// ============================================================
// SETTINGS
// ============================================================

function openSettings() {

    const modal =
        $("settingsModal");


    if (!modal) {

        alert(
            "Δεν βρέθηκε το παράθυρο Ρυθμίσεων."
        );

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


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );

}


// ============================================================
// SETTINGS RENDER
// ============================================================

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


    renderVehicleSettings();

}


// ============================================================
// GENERIC SETTINGS LIST
// ============================================================

function renderSettingList(
    containerId,
    list,
    type
) {

    const container =
        $(containerId);


    if (!container) return;


    container.innerHTML =
        "";


    list.forEach(
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

                    ${escapeHtml(
                        optionLabel(item)
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


// ============================================================
// VEHICLE SETTINGS
// ============================================================

function renderVehicleSettings() {

    let container =
        $("vehicleSettings");


    if (!container) return;


    container.innerHTML =
        "";


    // -----------------------------
    // GROUP CARS
    // -----------------------------

    const cars =
        settings.vehicles.filter(
            v =>
                v.type ===
                "Αυτοκίνητο"
        );


    const motorcycles =
        settings.vehicles.filter(
            v =>
                v.type ===
                "Μηχανή"
        );


    if (cars.length) {

        const title =
            document.createElement(
                "div"
            );

        title.innerHTML =
            "<strong>🚗 Αυτοκίνητα</strong>";

        container.appendChild(
            title
        );


        cars.forEach(
            vehicle =>
                appendVehicleRow(
                    container,
                    vehicle
                )
        );

    }


    if (motorcycles.length) {

        const title =
            document.createElement(
                "div"
            );

        title.innerHTML =
            "<strong>🏍️ Μηχανές</strong>";

        container.appendChild(
            title
        );


        motorcycles.forEach(
            vehicle =>
                appendVehicleRow(
                    container,
                    vehicle
                )
        );

    }


    if (
        !cars.length &&
        !motorcycles.length
    ) {

        container.innerHTML = `

            <div class="muted">

                Δεν έχουν προστεθεί
                ακόμη οχήματα.

            </div>

        `;

    }

}


function appendVehicleRow(
    container,
    vehicle
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "setting-row";


    row.innerHTML = `

        <span>

            ${escapeHtml(
                vehicle.icon
            )}

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
                    vehicle.id
                );

            }
        );


    container.appendChild(
        row
    );

}


// ============================================================
// ADD SETTING
// ============================================================

function addSetting(
    type,
    inputId
) {

    const input =
        $(inputId);


    if (!input) {

        alert(
            "Δεν βρέθηκε το πεδίο."
        );

        return;

    }


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Πληκτρολογήστε μια τιμή."
        );

        return;

    }


    const exists =
        settings[type].some(
            item =>
                optionName(item)
                    .toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "Αυτή η επιλογή υπάρχει ήδη."
        );

        return;

    }


    let icon =
        prompt(
            "Βάλτε ένα μικρό εικονίδιο/emoji για αυτή την επιλογή.\n\nΠατήστε Ακύρωση για το προεπιλεγμένο."
        );


    if (
        icon === null ||
        !icon.trim()
    ) {

        icon =
            "🔹";

    }


    settings[type].push({

        name:
            name,

        icon:
            icon.trim()

    });


    saveSettings();


    input.value =
        "";


    refreshSelects();


    renderSettings();

}


// ============================================================
// DELETE SETTING
// ============================================================

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
            `Να διαγραφεί το "${optionName(
                item
            )}";`
        );


    if (!confirmed) return;


    settings[type].splice(
        index,
        1
    );


    saveSettings();


    refreshSelects();


    renderSettings();

}


// ============================================================
// ADD VEHICLE
// ============================================================

function addVehicle() {

    let type =
        prompt(
            "Τύπος οχήματος:\n\n🚗 Αυτοκίνητο\n🏍️ Μηχανή\n\nΓράψτε: Αυτοκίνητο ή Μηχανή"
        );


    if (!type) return;


    type =
        type.trim();


    if (
        type.toLowerCase() ===
        "αυτοκινητο"
    ) {

        type =
            "Αυτοκίνητο";

    }


    if (
        type.toLowerCase() ===
        "μηχανη"
    ) {

        type =
            "Μηχανή";

    }


    if (
        type !==
        "Αυτοκίνητο" &&
        type !==
        "Μηχανή"
    ) {

        alert(
            "Παρακαλώ γράψτε Αυτοκίνητο ή Μηχανή."
        );

        return;

    }


    const make =
        prompt(
            "Μάρκα:"
        );


    if (make === null) return;


    const model =
        prompt(
            "Μοντέλο:"
        );


    if (model === null) return;


    const plate =
        prompt(
            "Αριθμός κυκλοφορίας:"
        );


    if (plate === null) return;


    const vehicle = {

        id:
            "vehicle-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 9),

        type:
            type,

        make:
            make.trim(),

        model:
            model.trim(),

        plate:
            plate.trim()
                .toUpperCase(),

        icon:
            type ===
            "Μηχανή"
                ? "🏍️"
                : "🚗"

    };


    settings.vehicles.push(
        vehicle
    );


    saveSettings();


    refreshSelects();


    renderSettings();


    alert(
        `${vehicle.icon} Το όχημα προστέθηκε:\n\n${vehicleLabel(
            vehicle
        )}`
    );

}


// ============================================================
// DELETE VEHICLE
// ============================================================

function deleteVehicle(id) {

    const index =
        settings.vehicles.findIndex(
            vehicle =>
                String(vehicle.id) ===
                String(id)
        );


    if (index < 0) return;


    const vehicle =
        settings.vehicles[index];


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
        `Να διαγραφεί το ${vehicle.icon} ${vehicleLabel(
            vehicle
        )};`;


    if (used) {

        message +=
            "\n\nΠροσοχή: υπάρχουν ήδη έξοδα συνδεδεμένα με αυτό το όχημα. Τα παλιά έξοδα δεν θα διαγραφούν.";

    }


    const confirmed =
        confirm(
            message
        );


    if (!confirmed) return;


    settings.vehicles.splice(
        index,
        1
    );


    saveSettings();


    refreshSelects();


    renderSettings();

}


// ============================================================
// RESET SETTINGS
// ============================================================

function resetSettings() {

    const confirmed =
        confirm(
            "Θέλετε να επαναφέρετε τις αρχικές ρυθμίσεις;"
        );


    if (!confirmed) return;


    settings =
        cloneObject(
            defaultSettings
        );


    saveSettings();


    refreshSelects();


    renderSettings();

}


// ============================================================
// REPORT
// ============================================================

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

    if (!$("reportType")) return;


    const today =
        new Date();


    const type =
        $("reportType").value;


    let start =
        new Date(today);


    let end =
        new Date(today);


    if (
        type ===
        "week"
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
        type ===
        "month"
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
        type ===
        "year"
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
        type !==
        "custom"
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


// ============================================================
// REPORT DATA
// ============================================================

function getReportExpenses() {

    const start =
        $("reportStartDate")
            ?.value ||
        "";


    const end =
        $("reportEndDate")
            ?.value ||
        "";


    const category =
        $("reportCategory")
            ?.value ||
        "all";


    const person =
        $("reportPerson")
            ?.value ||
        "all";


    const payment =
        $("reportPayment")
            ?.value ||
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
        );

}


// ============================================================
// CREATE REPORT
// ============================================================

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

                            <td>
                                ${escapeHtml(
                                    expense.odometer ||
                                    ""
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    expense.liters ||
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

                    font-family:
                        Arial,
                        sans-serif;

                    margin:
                        30px;

                    color:
                        #222;

                }


                h1 {

                    margin-bottom:
                        5px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-top:
                        20px;

                }


                th,
                td {

                    border:
                        1px solid #ccc;

                    padding:
                        8px;

                    text-align:
                        left;

                }


                th {

                    background:
                        #eee;

                }


                .amount {

                    text-align:
                        right;

                }


                .total {

                    margin-top:
                        20px;

                    font-size:
                        20px;

                    font-weight:
                        bold;

                }


                button {

                    padding:
                        10px 20px;

                    font-size:
                        16px;

                }


                @media print {

                    button {

                        display:
                            none;

                    }

                }

            </style>

        </head>


        <body>

            <h1>
                💰 Daily Expenses
            </h1>


            <p>

                Αναφορά από
                ${formatDate(
                    $("reportStartDate")
                        ?.value
                )}

                έως

                ${formatDate(
                    $("reportEndDate")
                        ?.value
                )}

            </p>


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
                            Πληρωμή
                        </th>

                        <th>
                            Για ποιον
                        </th>

                        <th>
                            Όχημα
                        </th>

                        <th>
                            Κατάστημα
                        </th>

                        <th>
                            Km
                        </th>

                        <th>
                            Λίτρα
                        </th>

                        <th>
                            Ποσό
                        </th>

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

                Εκτύπωση /
                Αποθήκευση ως PDF

            </button>

        </body>

        </html>

    `);


    reportWindow.document.close();

}


// ============================================================
// BACKUP
// ============================================================

function exportData() {

    const data = {

        version:
            5,

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


// ============================================================
// RESTORE
// ============================================================

function importData(file) {

    if (!file) return;


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
                    !data.settings ||
                    !Array.isArray(
                        data.expenses
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                const confirmed =
                    confirm(
                        "Η εισαγωγή θα αντικαταστήσει τα υπάρχοντα δεδομένα. Συνέχεια;"
                    );


                if (!confirmed) return;


                settings =
                    data.settings;


                expenses =
                    data.expenses;


                migrateSettings();


                saveSettings();


                saveExpenses();


                refreshSelects();


                renderSettings();


                renderDay(
                    $("selectedDate")
                        ?.value ||
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
                    "Το αρχείο backup δεν είναι έγκυρο."
                );

            }

        };


    reader.readAsText(
        file
    );

}


// ============================================================
// CLOCK
// ============================================================

function updateCurrentDateTime() {

    const element =
        $("currentDateTime");


    if (!element) return;


    element.textContent =
        new Date()
            .toLocaleString(
                "el-GR",
                {
                    dateStyle:
                        "full",

                    timeStyle:
                        "short"
                }
            );

}


// ============================================================
// INITIALIZATION
// ============================================================

function initializeApp() {

    // --------------------------------------------------------
    // MAIN BUTTONS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // SETTINGS
    // --------------------------------------------------------

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


    $("addVehicle")
        ?.addEventListener(
            "click",
            addVehicle
        );


    // --------------------------------------------------------
    // BACKUP
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // START
    // --------------------------------------------------------

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


// ============================================================
// START APP
// ============================================================

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