const STORAGE_KEY = "dailyExpensesV2";
const SETTINGS_KEY = "dailyExpensesSettingsV2";

const defaultSettings = {
    payments: [
        { name: "Κάρτα" },
        { name: "Μετρητά" },
        { name: "IRIS" },
        { name: "Τραπεζικός λογαριασμός" }
    ],

    categories: [
        { name: "Βενζίνη" },
        { name: "Φαγητό" },
        { name: "Εισιτήρια" },
        { name: "Καφέ" },
        { name: "Αγορές" },
        { name: "Συντήρηση οχήματος" },
        { name: "Διάφορα" }
    ],

    persons: [
        { name: "Εμένα" },
        { name: "Οικογένεια" },
        { name: "Άλλος" }
    ],

    purchaseMethods: [
        { name: "Φυσικό κατάστημα" },
        { name: "Internet" }
    ],

    internetOrigins: [
        { name: "Ελλάδα" },
        { name: "Εξωτερικό" }
    ],

    subcategories: [
        { name: "Super Market" },
        { name: "Ηλεκτρονικά" },
        { name: "Ρούχα" },
        { name: "Σπίτι" },
        { name: "Αυτοκίνητο" },
        { name: "Διάφορες αγορές" },
        { name: "Άλλο" }
    ],

    vehicles: []
};


let settings = loadJSON(
    SETTINGS_KEY,
    defaultSettings
);

let expenses = loadJSON(
    STORAGE_KEY,
    []
);

let editingExpenseId = null;


/* =========================================================
   BASIC FUNCTIONS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function cloneObject(object) {
    return JSON.parse(
        JSON.stringify(object)
    );
}


function loadJSON(key, fallback) {
    try {
        const stored =
            localStorage.getItem(key);

        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(error);
    }

    return cloneObject(fallback);
}


function saveExpenses() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(expenses)
        );
    } catch (error) {
        console.error(error);
    }
}


function saveSettings() {
    try {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );
    } catch (error) {
        console.error(error);
    }
}


function pad(value) {
    return String(value).padStart(2, "0");
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


/* =========================================================
   SETTINGS NORMALIZATION
   ========================================================= */

function normalizeOption(item) {

    if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
    ) {
        return {
            name:
                String(
                    item.name || ""
                ).trim()
        };
    }

    return {
        name:
            String(
                item || ""
            ).trim()
    };
}


function normalizeList(list) {

    if (!Array.isArray(list)) {
        return [];
    }

    return list
        .map(normalizeOption)
        .filter(
            item =>
                item.name !== ""
        );
}


function createVehicleId() {

    return (
        "vehicle-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2)
    );
}


function normalizeVehicle(vehicle) {

    if (
        vehicle &&
        typeof vehicle === "object"
    ) {
        return {
            id:
                vehicle.id ||
                createVehicleId(),

            type:
                vehicle.type === "Μηχανή"
                    ? "Μηχανή"
                    : "Αυτοκίνητο",

            make:
                String(
                    vehicle.make || ""
                ).trim(),

            model:
                String(
                    vehicle.model || ""
                ).trim(),

            plate:
                String(
                    vehicle.plate || ""
                ).trim()
        };
    }

    if (typeof vehicle === "string") {

        return {
            id: createVehicleId(),
            type: "Αυτοκίνητο",
            make: vehicle.trim(),
            model: "",
            plate: ""
        };
    }

    return null;
}


function migrateSettings() {

    if (
        !settings ||
        typeof settings !== "object"
    ) {
        settings =
            cloneObject(
                defaultSettings
            );
    }

    settings.payments =
        normalizeList(
            settings.payments
        );

    settings.categories =
        normalizeList(
            settings.categories
        );

    settings.persons =
        normalizeList(
            settings.persons
        );

    settings.purchaseMethods =
        normalizeList(
            settings.purchaseMethods
        );

    settings.internetOrigins =
        normalizeList(
            settings.internetOrigins
        );

    settings.subcategories =
        normalizeList(
            settings.subcategories
        );

    if (!Array.isArray(settings.vehicles)) {
        settings.vehicles = [];
    }

    settings.vehicles =
        settings.vehicles
            .map(normalizeVehicle)
            .filter(Boolean);

    saveSettings();
}


migrateSettings();


/* =========================================================
   OPTION HELPERS
   ========================================================= */

function optionName(item) {

    if (
        item &&
        typeof item === "object"
    ) {
        return item.name || "";
    }

    return String(item || "");
}


function findVehicle(id) {

    if (!id) {
        return null;
    }

    return settings.vehicles.find(
        vehicle =>
            String(vehicle.id) ===
            String(id)
    ) || null;
}


function vehicleLabel(vehicle) {

    if (!vehicle) {
        return "";
    }

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

    let result =
        parts.join(" ");

    if (vehicle.plate) {

        if (result) {
            result += " - ";
        }

        result +=
            vehicle.plate;
    }

    return (
        result ||
        "Όχημα χωρίς στοιχεία"
    );
}


/* =========================================================
   SELECT POPULATION
   ========================================================= */

function fillSelect(
    select,
    list,
    placeholder,
    includeAll = false
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

        select.appendChild(
            option
        );
    }

    if (includeAll) {

        const all =
            document.createElement(
                "option"
            );

        all.value = "all";

        all.textContent =
            "Όλα";

        select.appendChild(all);
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
                optionName(item);

            select.appendChild(
                option
            );
        }
    );
}


function populateMainSelects() {

    fillSelect(
        $("paymentMethod"),
        settings.payments,
        "Επιλέξτε τρόπο πληρωμής"
    );

    fillSelect(
        $("category"),
        settings.categories,
        "Επιλέξτε κατηγορία"
    );

    fillSelect(
        $("person"),
        settings.persons,
        "Επιλέξτε για ποιον"
    );

    fillSelect(
        $("subcategory"),
        settings.subcategories,
        "Επιλέξτε υποκατηγορία"
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
        settings.payments,
        null,
        true
    );

    setDefaultMainValues();

    updateVehicleSelection();
}


/* =========================================================
   DEFAULT VALUES
   ========================================================= */

function setDefaultMainValues() {

    /*
     * These are defaults, NOT mandatory fields.
     *
     * Only amount is mandatory.
     */

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

    if ($("orderStatus")) {

        $("orderStatus").value =
            "Παραγγέλθηκε";

    }
}


/* =========================================================
   VEHICLES
   ========================================================= */

function updateVehicleSelection() {

    const vehicle =
        $("vehicle");

    if (!vehicle) {
        return;
    }

    const type =
        $("vehicleType")
            ? $("vehicleType").value
            : "";

    const previousValue =
        vehicle.value;

    vehicle.innerHTML = "";

    const placeholder =
        document.createElement(
            "option"
        );

    placeholder.value = "";

    placeholder.textContent =
        type === "Αυτοκίνητο"
            ? "Επιλέξτε αυτοκίνητο"
            : type === "Μηχανή"
                ? "Επιλέξτε μηχανή"
                : "Επιλέξτε όχημα";

    vehicle.appendChild(
        placeholder
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
                    vehicleLabel(item);

                vehicle.appendChild(
                    option
                );
            }
        );

    if (
        previousValue &&
        findVehicle(previousValue)
    ) {
        vehicle.value =
            previousValue;
    }
}


/* =========================================================
   CATEGORY DEPENDENCIES
   ========================================================= */

function updateCategoryFields() {

    const category =
        $("category")
            ? $("category").value
            : "";

    const vehicleCategory =
        category === "Βενζίνη" ||
        category === "Συντήρηση οχήματος";

    const fuelCategory =
        category === "Βενζίνη";

    const shoppingCategory =
        category === "Αγορές";


    if ($("subcategoryWrap")) {

        $("subcategoryWrap")
            .classList.toggle(
                "hidden",
                !shoppingCategory
            );
    }


    if ($("vehicleTypeWrap")) {

        $("vehicleTypeWrap")
            .classList.toggle(
                "hidden",
                !vehicleCategory
            );
    }


    if ($("vehicleWrap")) {

        $("vehicleWrap")
            .classList.toggle(
                "hidden",
                !vehicleCategory
            );
    }


    if ($("litersWrap")) {

        $("litersWrap")
            .classList.toggle(
                "hidden",
                !fuelCategory
            );
    }


    if ($("odometerWrap")) {

        $("odometerWrap")
            .classList.toggle(
                "hidden",
                !fuelCategory
            );
    }


    if (!vehicleCategory) {

        if ($("vehicleType")) {
            $("vehicleType").value =
                "";
        }

        updateVehicleSelection();
    }


    if (!fuelCategory) {

        if ($("liters")) {
            $("liters").value =
                "";
        }

        if ($("odometer")) {
            $("odometer").value =
                "";
        }
    }


    if (!shoppingCategory) {

        if ($("subcategory")) {
            $("subcategory").value =
                "";
        }
    }
}


/* =========================================================
   PURCHASE METHOD
   ========================================================= */

function updatePurchaseMethodFields() {

    const method =
        $("purchaseMethod")
            ? $("purchaseMethod").value
            : "store";

    const internet =
        method === "internet";


    if ($("orderWrap")) {

        $("orderWrap")
            .classList.toggle(
                "hidden",
                !internet
            );
    }


    if ($("orderStatusWrap")) {

        $("orderStatusWrap")
            .classList.toggle(
                "hidden",
                !internet
            );
    }
}


/* =========================================================
   GPS
   ========================================================= */

function getCurrentPosition() {

    return new Promise(
        function(resolve) {

            if (
                !navigator.geolocation
            ) {
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

                    /*
                     * GPS is OPTIONAL.
                     *
                     * A denied/unavailable
                     * location must NEVER
                     * prevent saving a payment.
                     */

                    console.log(
                        "Η τοποθεσία δεν είναι διαθέσιμη:",
                        error.message
                    );

                    resolve(null);

                },

                {
                    enableHighAccuracy: true,
                    timeout: 8000,
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
            $("amount")?.value || 0
        );


    /*
     * IMPORTANT:
     *
     * ONLY AMOUNT IS REQUIRED.
     *
     * Category is NOT required.
     * Payment method is NOT required.
     * Person is NOT required.
     * Purchase method is NOT required.
     * Vehicle is NOT required.
     * Location is NOT required.
     */

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Πρέπει να συμπληρώσεις μόνο το ποσό."
        );

        $("amount")?.focus();

        return false;
    }

    return true;
}


/* =========================================================
   ADD / UPDATE PAYMENT
   ========================================================= */

async function addOrUpdatePayment() {

    if (!validatePayment()) {
        return;
    }


    const amount =
        Number(
            $("amount").value
        );


    /*
     * Try to get GPS, but NEVER wait
     * indefinitely and NEVER block
     * the payment if GPS is unavailable.
     */

    let location = null;

    try {

        location =
            await getCurrentPosition();

    } catch (error) {

        location = null;

    }


    const vehicle =
        findVehicle(
            $("vehicle")?.value
        );


    const payment = {

        id:
            editingExpenseId ||
            (
                "payment-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2)
            ),

        date:
            $("selectedDate")?.value ||
            getToday(),

        time:
            getCurrentTime(),

        amount:
            Number(
                amount.toFixed(2)
            ),


        /* Defaults */

        paymentMethod:
            $("paymentMethod")?.value ||
            "Κάρτα",

        person:
            $("person")?.value ||
            "Εμένα",

        purchaseMethod:
            $("purchaseMethod")?.value ||
            "store",


        /* Optional */

        category:
            $("category")?.value ||
            "",

        subcategory:
            $("subcategory")?.value ||
            "",

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


        /* Vehicle */

        vehicleId:
            vehicle
                ? vehicle.id
                : "",

        vehicleType:
            vehicle
                ? vehicle.type
                : "",

        vehicle:
            vehicle
                ? vehicleLabel(vehicle)
                : "",


        /* Fuel */

        liters:
            Number(
                $("liters")?.value || 0
            ),

        odometer:
            Number(
                $("odometer")?.value || 0
            ),


        /* GPS */

        location:
            location,


        createdAt:
            new Date().toISOString()
    };


    if (editingExpenseId) {

        const index =
            expenses.findIndex(
                item =>
                    String(item.id) ===
                    String(
                        editingExpenseId
                    )
            );


        if (index >= 0) {

            /*
             * If GPS is unavailable during
             * editing, preserve the old
             * location instead of deleting it.
             */

            if (
                !location &&
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
}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearPaymentForm() {

    editingExpenseId = null;


    if ($("amount")) {
        $("amount").value = "";
    }


    if ($("category")) {
        $("category").value = "";
    }


    if ($("subcategory")) {
        $("subcategory").value = "";
    }


    if ($("vehicleType")) {
        $("vehicleType").value = "";
    }


    if ($("liters")) {
        $("liters").value = "";
    }


    if ($("odometer")) {
        $("odometer").value = "";
    }


    if ($("shop")) {
        $("shop").value = "";
    }


    if ($("orderNumber")) {
        $("orderNumber").value = "";
    }


    if ($("description")) {
        $("description").value = "";
    }


    /*
     * Restore defaults after every
     * successful payment.
     */

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


    if ($("orderStatus")) {

        $("orderStatus").value =
            "Παραγγέλθηκε";

    }


    updateCategoryFields();

    updatePurchaseMethodFields();

    updateVehicleSelection();
}


/* =========================================================
   DAILY VIEW
   ========================================================= */

function getExpensesForDate(date) {

    return expenses
        .filter(
            expense =>
                expense.date === date
        )
        .sort(
            (a, b) =>
                String(
                    a.time || ""
                ).localeCompare(
                    String(
                        b.time || ""
                    )
                )
        );
}


function renderDay() {

    const date =
        $("selectedDate")?.value ||
        getToday();


    const list =
        getExpensesForDate(date);


    const total =
        list.reduce(
            (sum, expense) =>
                sum +
                Number(
                    expense.amount || 0
                ),
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
                        ${formatMoney(total)}
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
                        ${formatMoney(average)}
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
        payment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "expense-item";


            const details = [];


            if (payment.paymentMethod) {

                details.push(
                    "Πληρωμή: " +
                    payment.paymentMethod
                );

            }


            if (payment.category) {

                details.push(
                    "Κατηγορία: " +
                    payment.category
                );

            }


            if (payment.subcategory) {

                details.push(
                    "Υποκατηγορία: " +
                    payment.subcategory
                );

            }


            if (payment.person) {

                details.push(
                    "Για: " +
                    payment.person
                );

            }


            if (payment.vehicle) {

                details.push(
                    "Όχημα: " +
                    payment.vehicle
                );

            }


            if (payment.liters) {

                details.push(
                    "Λίτρα: " +
                    payment.liters
                );

            }


            if (payment.odometer) {

                details.push(
                    "Χιλιόμετρα: " +
                    payment.odometer
                );

            }


            if (payment.shop) {

                details.push(
                    "Κατάστημα: " +
                    payment.shop
                );

            }


            if (payment.orderNumber) {

                details.push(
                    "Παραγγελία: " +
                    payment.orderNumber
                );

            }


            if (payment.orderStatus) {

                details.push(
                    "Κατάσταση: " +
                    payment.orderStatus
                );

            }


            if (payment.location) {

                details.push(
                    "Τοποθεσία: καταχωρημένη"
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

                            ${escapeHtml(
                                payment.time || ""
                            )}

                            —

                            ${escapeHtml(
                                payment.category ||
                                "Χωρίς κατηγορία"
                            )}

                        </strong>


                        <div class="expense-details">

                            ${details
                                .map(
                                    detail =>
                                        `<div>${escapeHtml(detail)}</div>`
                                )
                                .join("")}

                        </div>

                    </div>


                    <div class="expense-amount">

                        ${formatMoney(
                            payment.amount
                        )}

                    </div>

                </div>


                <div class="expense-actions">

                    <button
                        type="button"
                        class="secondary edit-payment"
                        data-id="${escapeHtml(
                            payment.id
                        )}">

                        Επεξεργασία

                    </button>


                    <button
                        type="button"
                        class="danger delete-payment"
                        data-id="${escapeHtml(
                            payment.id
                        )}">

                        Διαγραφή

                    </button>

                </div>
            `;


            container.appendChild(item);
        }
    );


    container
        .querySelectorAll(
            ".delete-payment"
        )
        .forEach(
            button => {

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


    container
        .querySelectorAll(
            ".edit-payment"
        )
        .forEach(
            button => {

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
}


/* =========================================================
   EDIT / DELETE
   ========================================================= */

function deletePayment(id) {

    const exists =
        expenses.some(
            item =>
                String(item.id) ===
                String(id)
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
            item =>
                String(item.id) !==
                String(id)
        );


    saveExpenses();

    renderDay();
}


function editPayment(id) {

    const payment =
        expenses.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!payment) {
        return;
    }


    editingExpenseId =
        payment.id;


    if ($("selectedDate")) {

        $("selectedDate").value =
            payment.date ||
            getToday();

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


    if ($("category")) {

        $("category").value =
            payment.category ||
            "";

    }


    updateCategoryFields();


    if ($("subcategory")) {

        $("subcategory").value =
            payment.subcategory ||
            "";

    }


    if ($("vehicleType")) {

        $("vehicleType").value =
            payment.vehicleType ||
            "";

    }


    updateVehicleSelection();


    if ($("vehicle")) {

        $("vehicle").value =
            payment.vehicleId ||
            "";

    }


    if ($("liters")) {

        $("liters").value =
            payment.liters ||
            "";

    }


    if ($("odometer")) {

        $("odometer").value =
            payment.odometer ||
            "";

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


    updatePurchaseMethodFields();


    if ($("shop")) {

        $("shop").value =
            payment.shop ||
            "";

    }


    if ($("orderNumber")) {

        $("orderNumber").value =
            payment.orderNumber ||
            "";

    }


    if ($("orderStatus")) {

        $("orderStatus").value =
            payment.orderStatus ||
            "Παραγγέλθηκε";

    }


    if ($("description")) {

        $("description").value =
            payment.description ||
            "";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


/* =========================================================
   DATE / TIME
   ========================================================= */

function updateCurrentDateTime() {

    const element =
        $("currentDateTime");


    if (!element) {
        return;
    }


    element.textContent =
        new Date().toLocaleString(
            "el-GR",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
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
        getToday();


    if (type === "custom") {
        return;
    }


    const date =
        new Date(
            selected +
            "T12:00:00"
        );


    let start =
        selected;


    let end =
        selected;


    if (type === "week") {

        const day =
            date.getDay();


        const offset =
            day === 0
                ? -6
                : 1 - day;


        const monday =
            new Date(date);


        monday.setDate(
            date.getDate() +
            offset
        );


        const sunday =
            new Date(monday);


        sunday.setDate(
            monday.getDate() +
            6
        );


        start =
            monday.toISOString()
                .slice(0, 10);


        end =
            sunday.toISOString()
                .slice(0, 10);
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
            first.toISOString()
                .slice(0, 10);


        end =
            last.toISOString()
                .slice(0, 10);
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

        $("reportStartDate").value =
            start;

    }


    if ($("reportEndDate")) {

        $("reportEndDate").value =
            end;

    }
}


/* =========================================================
   REPORT
   ========================================================= */

function getReportExpenses() {

    const start =
        $("reportStartDate")?.value ||
        getToday();


    const end =
        $("reportEndDate")?.value ||
        start;


    const category =
        $("reportCategory")?.value ||
        "all";


    const person =
        $("reportPerson")?.value ||
        "all";


    const payment =
        $("reportPayment")?.value ||
        "all";


    return expenses.filter(
        expense => {

            if (
                expense.date < start ||
                expense.date > end
            ) {
                return false;
            }


            if (
                category !== "all" &&
                expense.category !==
                    category
            ) {
                return false;
            }


            if (
                person !== "all" &&
                expense.person !==
                    person
            ) {
                return false;
            }


            if (
                payment !== "all" &&
                expense.paymentMethod !==
                    payment
            ) {
                return false;
            }


            return true;
        }
    );
}


function generateReport() {

    const list =
        getReportExpenses();


    if (!list.length) {

        alert(
            "Δεν υπάρχουν πληρωμές για την επιλεγμένη περίοδο."
        );

        return;
    }


    const start =
        $("reportStartDate")?.value ||
        "";


    const end =
        $("reportEndDate")?.value ||
        "";


    const total =
        list.reduce(
            (sum, payment) =>
                sum +
                Number(
                    payment.amount || 0
                ),
            0
        );


    const categoryTotals = {};


    list.forEach(
        payment => {

            const category =
                payment.category ||
                "Χωρίς κατηγορία";


            categoryTotals[category] =
                (
                    categoryTotals[category] ||
                    0
                ) +
                Number(
                    payment.amount || 0
                );
        }
    );


    const categoryRows =
        Object.entries(
            categoryTotals
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .map(
            ([category, amount]) =>
                `
                <tr>

                    <td>
                        ${escapeHtml(category)}
                    </td>

                    <td>
                        ${formatMoney(amount)}
                    </td>

                </tr>
                `
        )
        .join("");


    const rows =
        list
            .slice()
            .sort(
                (a, b) =>
                    String(a.date)
                        .localeCompare(
                            String(b.date)
                        ) ||
                    String(a.time || "")
                        .localeCompare(
                            String(
                                b.time || ""
                            )
                        )
            )
            .map(
                payment =>
                    `
                    <tr>

                        <td>
                            ${escapeHtml(
                                formatDate(
                                    payment.date
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.time || ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.category ||
                                "Χωρίς κατηγορία"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.paymentMethod ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.person ||
                                ""
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                payment.amount
                            )}
                        </td>

                    </tr>
                    `
            )
            .join("");


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    if (!reportWindow) {

        alert(
            "Το Safari μπλόκαρε το παράθυρο του Report."
        );

        return;
    }


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
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;

    margin: 30px;

    color: #111827;

}


h1 {

    margin-bottom: 5px;

}


.meta {

    color: #6b7280;

    margin-bottom: 25px;

}


.summary {

    display: flex;

    gap: 15px;

    margin-bottom: 30px;

}


.box {

    border:
        1px solid #d1d5db;

    border-radius: 10px;

    padding: 15px;

    min-width: 160px;

}


.box strong {

    display: block;

    font-size: 22px;

    margin-top: 5px;

}


table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 15px;

}


th,
td {

    border:
        1px solid #d1d5db;

    padding: 8px;

    text-align: left;

}


th {

    background: #f3f4f6;

}


.total {

    margin-top: 20px;

    text-align: right;

    font-size: 20px;

    font-weight: 700;

}


.print-button {

    margin-top: 25px;

    padding: 10px 16px;

}


@media print {

    .print-button {

        display: none;

    }

    body {

        margin: 10mm;

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

    ${escapeHtml(
        formatDate(start)
    )}

    -

    ${escapeHtml(
        formatDate(end)
    )}

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
            ${formatMoney(total)}
        </strong>

    </div>


    <div class="box">

        Μέση πληρωμή

        <strong>
            ${formatMoney(
                total / list.length
            )}
        </strong>

    </div>


</div>


<h2>
Ανάλυση ανά κατηγορία
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
        Πληρωμή
    </th>

    <th>
        Για ποιον
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


<button
    class="print-button"
    onclick="window.print()">

    Εκτύπωση / Αποθήκευση ως PDF

</button>


</body>

</html>

    `);


    reportWindow.document.close();
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
   SETTINGS RENDERING
   ========================================================= */

function renderSimpleSettings(
    containerId,
    list,
    settingName
) {

    const container =
        $(containerId);


    if (!container) {
        return;
    }


    container.innerHTML = "";


    list.forEach(
        (item, index) => {

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


            input.type =
                "text";


            input.value =
                optionName(item);


            const save =
                document.createElement(
                    "button"
                );


            save.type =
                "button";


            save.textContent =
                "Αποθήκευση";


            save.addEventListener(
                "click",
                function() {

                    const value =
                        input.value.trim();


                    if (!value) {
                        return;
                    }


                    settings[
                        settingName
                    ][index].name =
                        value;


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


                    settings[
                        settingName
                    ].splice(
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


function renderVehicleSettings() {

    const container =
        $("vehicleSettings");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    settings.vehicles.forEach(
        (vehicle, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "vehicle-setting";


            const type =
                document.createElement(
                    "select"
                );


            const car =
                document.createElement(
                    "option"
                );


            car.value =
                "Αυτοκίνητο";


            car.textContent =
                "Αυτοκίνητο";


            const motorcycle =
                document.createElement(
                    "option"
                );


            motorcycle.value =
                "Μηχανή";


            motorcycle.textContent =
                "Μηχανή";


            type.appendChild(car);

            type.appendChild(
                motorcycle
            );


            type.value =
                vehicle.type;


            const make =
                document.createElement(
                    "input"
                );


            make.type =
                "text";


            make.placeholder =
                "Μάρκα";


            make.value =
                vehicle.make;


            const model =
                document.createElement(
                    "input"
                );


            model.type =
                "text";


            model.placeholder =
                "Μοντέλο";


            model.value =
                vehicle.model;


            const plate =
                document.createElement(
                    "input"
                );


            plate.type =
                "text";


            plate.placeholder =
                "Πινακίδα";


            plate.value =
                vehicle.plate;


            const save =
                document.createElement(
                    "button"
                );


            save.type =
                "button";


            save.textContent =
                "Αποθήκευση";


            save.addEventListener(
                "click",
                function() {

                    vehicle.type =
                        type.value;


                    vehicle.make =
                        make.value.trim();


                    vehicle.model =
                        model.value.trim();


                    vehicle.plate =
                        plate.value.trim();


                    saveSettings();

                    populateMainSelects();

                    renderVehicleSettings();

                }
            );


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


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

                    renderVehicleSettings();

                }
            );


            row.appendChild(type);

            row.appendChild(make);

            row.appendChild(model);

            row.appendChild(plate);

            row.appendChild(save);

            row.appendChild(remove);


            container.appendChild(row);

        }
    );
}


function renderSettings() {

    renderSimpleSettings(
        "paymentSettings",
        settings.payments,
        "payments"
    );


    renderSimpleSettings(
        "categorySettings",
        settings.categories,
        "categories"
    );


    renderSimpleSettings(
        "personSettings",
        settings.persons,
        "persons"
    );


    renderSimpleSettings(
        "subcategorySettings",
        settings.subcategories,
        "subcategories"
    );


    renderVehicleSettings();
}


/* =========================================================
   ADD SETTINGS
   ========================================================= */

function addSetting(
    inputId,
    settingName
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


    const exists =
        settings[settingName].some(
            item =>
                optionName(item)
                    .toLowerCase() ===
                value.toLowerCase()
        );


    if (exists) {

        alert(
            "Η επιλογή υπάρχει ήδη."
        );

        return;
    }


    settings[settingName].push({
        name: value
    });


    input.value = "";


    saveSettings();

    populateMainSelects();

    renderSettings();
}


function addVehicleFromSettings() {

    const input =
        $("newVehicle");


    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    if (!value) {
        return;
    }


    settings.vehicles.push({

        id:
            createVehicleId(),

        type:
            "Αυτοκίνητο",

        make:
            value,

        model:
            "",

        plate:
            ""

    });


    input.value = "";


    saveSettings();

    populateMainSelects();

    renderVehicleSettings();
}


function resetSettings() {

    if (
        !confirm(
            "Θέλεις να επαναφέρεις όλες τις ρυθμίσεις στις αρχικές τιμές;"
        )
    ) {
        return;
    }


    settings =
        cloneObject(
            defaultSettings
        );


    saveSettings();

    populateMainSelects();

    renderSettings();

    updateCategoryFields();

    updatePurchaseMethodFields();
}


/* =========================================================
   EXPORT / IMPORT
   ========================================================= */

function exportData() {

    const backup = {

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
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "daily-expenses-backup-" +
        getToday() +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(url);
}


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
                    typeof data !==
                        "object"
                ) {
                    throw new Error(
                        "Invalid backup"
                    );
                }


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
                    "Η εισαγωγή ολοκληρώθηκε."
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
   INITIALIZATION
   ========================================================= */

function initialize() {


    if ($("selectedDate")) {

        $("selectedDate").value =
            getToday();

    }


    if ($("reportStartDate")) {

        $("reportStartDate").value =
            getToday();

    }


    if ($("reportEndDate")) {

        $("reportEndDate").value =
            getToday();

    }


    populateMainSelects();

    updateCategoryFields();

    updatePurchaseMethodFields();

    renderSettings();

    renderDay();

    updateCurrentDateTime();

    updateReportDates();


    /* Settings */

    if ($("settingsButton")) {

        $("settingsButton")
            .addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    openSettings();

                }
            );
    }


    if ($("closeSettings")) {

        $("closeSettings")
            .addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    closeSettings();

                }
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
                event.key ===
                "Escape"
            ) {

                const modal =
                    $("settingsModal");


                if (
                    modal &&
                    !modal.classList.contains(
                        "hidden"
                    )
                ) {

                    closeSettings();

                }

            }

        }
    );


    /* Add payment */

    if ($("addExpenseButton")) {

        $("addExpenseButton")
            .addEventListener(
                "click",
                addOrUpdatePayment
            );

    }


    /* Category */

    if ($("category")) {

        $("category")
            .addEventListener(
                "change",
                updateCategoryFields
            );

    }


    /* Vehicle */

    if ($("vehicleType")) {

        $("vehicleType")
            .addEventListener(
                "change",
                updateVehicleSelection
            );

    }


    /* Purchase */

    if ($("purchaseMethod")) {

        $("purchaseMethod")
            .addEventListener(
                "change",
                updatePurchaseMethodFields
            );

    }


    /* Date */

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


    /* Reports */

    if ($("reportType")) {

        $("reportType")
            .addEventListener(
                "change",
                updateReportDates
            );

    }


    if ($("generateReportButton")) {

        $("generateReportButton")
            .addEventListener(
                "click",
                generateReport
            );

    }


    /* Settings additions */

    if ($("addPayment")) {

        $("addPayment")
            .addEventListener(
                "click",
                function() {

                    addSetting(
                        "newPayment",
                        "payments"
                    );

                }
            );

    }


    if ($("addCategory")) {

        $("addCategory")
            .addEventListener(
                "click",
                function() {

                    addSetting(
                        "newCategory",
                        "categories"
                    );

                }
            );

    }


    if ($("addPerson")) {

        $("addPerson")
            .addEventListener(
                "click",
                function() {

                    addSetting(
                        "newPerson",
                        "persons"
                    );

                }
            );

    }


    if ($("addSubcategory")) {

        $("addSubcategory")
            .addEventListener(
                "click",
                function() {

                    addSetting(
                        "newSubcategory",
                        "subcategories"
                    );

                }
            );

    }


    if ($("addVehicle")) {

        $("addVehicle")
            .addEventListener(
                "click",
                addVehicleFromSettings
            );

    }


    if ($("resetSettings")) {

        $("resetSettings")
            .addEventListener(
                "click",
                resetSettings
            );

    }


    /* Backup */

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


    /* Enter key in settings */

    [

        ["newPayment", "addPayment"],

        ["newCategory", "addCategory"],

        ["newPerson", "addPerson"],

        ["newSubcategory", "addSubcategory"],

        ["newVehicle", "addVehicle"]

    ]
    .forEach(
        pair => {

            const input =
                $(pair[0]);

            const button =
                $(pair[1]);


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
        updateCurrentDateTime,
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