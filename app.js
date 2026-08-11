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


/* ============================================================
   BASIC FUNCTIONS
   ============================================================ */

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
        console.error(
            "Error loading data:",
            error
        );
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
        console.error(
            "Error saving expenses:",
            error
        );
    }
}


function saveSettings() {
    try {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );
    } catch (error) {
        console.error(
            "Error saving settings:",
            error
        );
    }
}


function pad(value) {
    return String(value).padStart(2, "0");
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


/* ============================================================
   SETTINGS NORMALIZATION
   ============================================================ */

function normalizeOption(item) {
    if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
    ) {
        return {
            name: String(
                item.name || ""
            ).trim()
        };
    }

    return {
        name: String(
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
    settings =
        settings &&
        typeof settings === "object"
            ? settings
            : cloneObject(defaultSettings);

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


migrateSettings();


/* ============================================================
   OPTION FUNCTIONS
   ============================================================ */

function optionName(item) {
    if (
        item &&
        typeof item === "object"
    ) {
        return item.name || "";
    }

    return String(item || "");
}


function findOption(list, name) {
    return list.find(
        item =>
            optionName(item) ===
            String(name || "")
    );
}


/* ============================================================
   VEHICLES
   ============================================================ */

function vehicleLabel(vehicle) {
    if (!vehicle) {
        return "";
    }

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

        result +=
            vehicle.plate;
    }

    return (
        result ||
        "Όχημα χωρίς στοιχεία"
    );
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


function updateVehicleSelection() {
    const vehicleType =
        $("vehicleType");

    const vehicle =
        $("vehicle");

    if (!vehicle) {
        return;
    }

    const type =
        vehicleType
            ? vehicleType.value
            : "";

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
        .forEach(item => {

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
        });
}


/* ============================================================
   SELECT FUNCTIONS
   ============================================================ */

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

    if (placeholder) {
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

    list.forEach(item => {

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
    });
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

    updateVehicleSelection();
}


/* ============================================================
   CATEGORY / PURCHASE UI
   ============================================================ */

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
            $("vehicleType").value = "";
        }

        updateVehicleSelection();
    }

    if (!fuelCategory) {
        if ($("liters")) {
            $("liters").value = "";
        }

        if ($("odometer")) {
            $("odometer").value = "";
        }
    }

    if (!shoppingCategory) {
        if ($("subcategory")) {
            $("subcategory").value = "";
        }
    }
}


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


/* ============================================================
   SETTINGS MODAL
   ============================================================ */

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

            input.type = "text";

            input.value =
                optionName(item);

            const save =
                document.createElement(
                    "button"
                );

            save.type = "button";

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

                    settings[settingName][
                        index
                    ].name = value;

                    saveSettings();
                    populateMainSelects();
                    renderSettings();
                    updateCategoryFields();

                }
            );

            const remove =
                document.createElement(
                    "button"
                );

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

                    settings[
                        settingName
                    ].splice(
                        index,
                        1
                    );

                    saveSettings();
                    populateMainSelects();
                    renderSettings();
                    updateCategoryFields();

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

            make.type = "text";
            make.placeholder = "Μάρκα";
            make.value =
                vehicle.make;

            const model =
                document.createElement(
                    "input"
                );

            model.type = "text";
            model.placeholder = "Μοντέλο";
            model.value =
                vehicle.model;

            const plate =
                document.createElement(
                    "input"
                );

            plate.type = "text";
            plate.placeholder = "Πινακίδα";
            plate.value =
                vehicle.plate;

            const save =
                document.createElement(
                    "button"
                );

            save.type = "button";
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
        id: createVehicleId(),
        type: "Αυτοκίνητο",
        make: value,
        model: "",
        plate: ""
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
        cloneObject(defaultSettings);

    saveSettings();

    populateMainSelects();

    renderSettings();

    updateCategoryFields();

    updatePurchaseMethodFields();
}


/* ============================================================
   IMPORT / EXPORT
   ============================================================ */

function exportData() {
    const backup = {
        version: 2,
        exportedAt:
            new Date().toISOString(),
        settings: settings,
        expenses: expenses
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
        getToday() +
        ".json";

    document.body.appendChild(link);

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
                    typeof data !== "object"
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


/* ============================================================
   GPS / LOCATION
   ============================================================ */

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
                            Number(
                                position.coords.latitude
                            ),

                        longitude:
                            Number(
                                position.coords.longitude
                            ),

                        accuracy:
                            Number(
                                position.coords.accuracy ||
                                0
                            ),

                        timestamp:
                            new Date(
                                position.timestamp ||
                                Date.now()
                            ).toISOString()
                    });

                },

                function(error) {

                    console.warn(
                        "Location unavailable:",
                        error.message
                    );

                    resolve(null);
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        }
    );
}


/* ============================================================
   EXPENSE FORM
   ============================================================ */

function validateExpenseForm() {
    const amount =
        Number(
            $("amount")?.value || 0
        );

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert(
            "Συμπλήρωσε έγκυρο ποσό."
        );

        $("amount")?.focus();

        return false;
    }

    if (
        !$("category")?.value
    ) {
        alert(
            "Επίλεξε κατηγορία."
        );

        $("category")?.focus();

        return false;
    }

    if (
        !$("paymentMethod")?.value
    ) {
        alert(
            "Επίλεξε τρόπο πληρωμής."
        );

        $("paymentMethod")?.focus();

        return false;
    }

    if (
        !$("person")?.value
    ) {
        alert(
            "Επίλεξε για ποιον είναι το έξοδο."
        );

        $("person")?.focus();

        return false;
    }

    const category =
        $("category").value;

    const vehicleCategory =
        category === "Βενζίνη" ||
        category ===
            "Συντήρηση οχήματος";

    if (
        vehicleCategory &&
        !$("vehicle")?.value
    ) {
        alert(
            "Επίλεξε το όχημα."
        );

        $("vehicle")?.focus();

        return false;
    }

    return true;
}


async function createExpense() {
    if (!validateExpenseForm()) {
        return;
    }

    const vehicle =
        findVehicle(
            $("vehicle")?.value
        );

    const location =
        await getCurrentPosition();

    const expense = {

        id:
            editingExpenseId ||
            (
                "expense-" +
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
                $("amount").value
            ),

        paymentMethod:
            $("paymentMethod").value,

        category:
            $("category").value,

        subcategory:
            $("subcategory")?.value ||
            "",

        person:
            $("person").value,

        purchaseMethod:
            $("purchaseMethod")?.value ||
            "store",

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

        liters:
            Number(
                $("liters")?.value || 0
            ),

        odometer:
            Number(
                $("odometer")?.value || 0
            ),

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
                    String(editingExpenseId)
            );

        if (index >= 0) {
            expenses[index] =
                expense;
        }

    } else {

        expenses.push(expense);

    }

    saveExpenses();

    editingExpenseId = null;

    clearExpenseForm();

    renderDay();

    alert(
        location
            ? "Το έξοδο καταχωρήθηκε μαζί με την τοποθεσία."
            : "Το έξοδο καταχωρήθηκε. Η τοποθεσία δεν ήταν διαθέσιμη."
    );
}


function clearExpenseForm() {
    editingExpenseId = null;

    if ($("amount")) {
        $("amount").value = "";
    }

    if ($("paymentMethod")) {
        $("paymentMethod").value = "";
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

    if ($("person")) {
        $("person").value = "";
    }

    if ($("purchaseMethod")) {
        $("purchaseMethod").value =
            "store";
    }

    if ($("shop")) {
        $("shop").value = "";
    }

    if ($("orderNumber")) {
        $("orderNumber").value = "";
    }

    if ($("orderStatus")) {
        $("orderStatus").value =
            "Παραγγέλθηκε";
    }

    if ($("description")) {
        $("description").value = "";
    }

    updateCategoryFields();

    updatePurchaseMethodFields();

    updateVehicleSelection();
}


/* ============================================================
   DAILY VIEW
   ============================================================ */

function getExpensesForDate(date) {
    return expenses
        .filter(
            expense =>
                expense.date === date
        )
        .sort(
            function(a, b) {

                return String(
                    a.time || ""
                ).localeCompare(
                    String(
                        b.time || ""
                    )
                );
            }
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
            function(sum, expense) {

                return (
                    sum +
                    Number(
                        expense.amount || 0
                    )
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

    const summary =
        $("daySummary");

    if (summary) {

        summary.innerHTML = `
            <div class="summary">

                <div class="summary-box">
                    <span>Σύνολο</span>
                    <strong>${formatMoney(total)}</strong>
                </div>

                <div class="summary-box">
                    <span>Έξοδα</span>
                    <strong>${count}</strong>
                </div>

                <div class="summary-box">
                    <span>Μέσο έξοδο</span>
                    <strong>${formatMoney(average)}</strong>
                </div>

            </div>
        `;
    }

    renderExpenseList(list);
}


function renderExpenseList(list) {
    const container =
        $("expenseList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!list.length) {

        container.innerHTML = `
            <div class="muted">
                Δεν υπάρχουν έξοδα για αυτή την ημερομηνία.
            </div>
        `;

        return;
    }

    list.forEach(
        function(expense) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "expense-item";

            const details = [];

            if (expense.paymentMethod) {
                details.push(
                    expense.paymentMethod
                );
            }

            if (expense.person) {
                details.push(
                    "Για: " +
                    expense.person
                );
            }

            if (expense.subcategory) {
                details.push(
                    "Υποκατηγορία: " +
                    expense.subcategory
                );
            }

            if (expense.vehicle) {
                details.push(
                    "Όχημα: " +
                    expense.vehicle
                );
            }

            if (expense.liters) {
                details.push(
                    "Λίτρα: " +
                    expense.liters
                );
            }

            if (expense.odometer) {
                details.push(
                    "Χιλιόμετρα: " +
                    expense.odometer
                );
            }

            if (expense.shop) {
                details.push(
                    "Κατάστημα: " +
                    expense.shop
                );
            }

            if (expense.orderNumber) {
                details.push(
                    "Παραγγελία: " +
                    expense.orderNumber
                );
            }

            if (expense.orderStatus) {
                details.push(
                    "Κατάσταση: " +
                    expense.orderStatus
                );
            }

            const locationText =
                expense.location
                    ? "Τοποθεσία καταχωρημένη"
                    : "";

            if (locationText) {
                details.push(
                    locationText
                );
            }

            if (expense.description) {
                details.push(
                    expense.description
                );
            }

            item.innerHTML = `
                <div class="expense-main">

                    <div>

                        <strong>
                            ${escapeHtml(
                                expense.time || ""
                            )}
                            —
                            ${escapeHtml(
                                expense.category || ""
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
                            expense.amount
                        )}
                    </div>

                </div>

                <div class="expense-actions">

                    <button
                        type="button"
                        class="secondary edit-expense"
                        data-id="${escapeHtml(
                            expense.id
                        )}">
                        Επεξεργασία
                    </button>

                    <button
                        type="button"
                        class="danger delete-expense"
                        data-id="${escapeHtml(
                            expense.id
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
            ".delete-expense"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        deleteExpense(
                            button.dataset.id
                        );

                    }
                );
            }
        );

    container
        .querySelectorAll(
            ".edit-expense"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        editExpense(
                            button.dataset.id
                        );

                    }
                );
            }
        );
}


/* ============================================================
   EDIT / DELETE
   ============================================================ */

function deleteExpense(id) {
    const exists =
        expenses.some(
            expense =>
                String(expense.id) ===
                String(id)
        );

    if (!exists) {
        return;
    }

    if (
        !confirm(
            "Να διαγραφεί αυτό το έξοδο;"
        )
    ) {
        return;
    }

    expenses =
        expenses.filter(
            expense =>
                String(expense.id) !==
                String(id)
        );

    saveExpenses();

    renderDay();
}


function editExpense(id) {
    const expense =
        expenses.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!expense) {
        return;
    }

    editingExpenseId =
        expense.id;

    if ($("selectedDate")) {
        $("selectedDate").value =
            expense.date || getToday();
    }

    if ($("amount")) {
        $("amount").value =
            expense.amount || "";
    }

    if ($("paymentMethod")) {
        $("paymentMethod").value =
            expense.paymentMethod || "";
    }

    if ($("category")) {
        $("category").value =
            expense.category || "";
    }

    updateCategoryFields();

    if ($("subcategory")) {
        $("subcategory").value =
            expense.subcategory || "";
    }

    if ($("vehicleType")) {
        $("vehicleType").value =
            expense.vehicleType || "";
    }

    updateVehicleSelection();

    if ($("vehicle")) {
        $("vehicle").value =
            expense.vehicleId || "";
    }

    if ($("liters")) {
        $("liters").value =
            expense.liters || "";
    }

    if ($("odometer")) {
        $("odometer").value =
            expense.odometer || "";
    }

    if ($("person")) {
        $("person").value =
            expense.person || "";
    }

    if ($("purchaseMethod")) {
        $("purchaseMethod").value =
            expense.purchaseMethod ||
            "store";
    }

    updatePurchaseMethodFields();

    if ($("shop")) {
        $("shop").value =
            expense.shop || "";
    }

    if ($("orderNumber")) {
        $("orderNumber").value =
            expense.orderNumber || "";
    }

    if ($("orderStatus")) {
        $("orderStatus").value =
            expense.orderStatus ||
            "Παραγγέλθηκε";
    }

    if ($("description")) {
        $("description").value =
            expense.description || "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ============================================================
   DATE / CLOCK
   ============================================================ */

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


/* ============================================================
   REPORT DATES
   ============================================================ */

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


/* ============================================================
   REPORT
   ============================================================ */

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
                expense.paymentMethod !== payment
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
            "Δεν υπάρχουν έξοδα για την επιλεγμένη περίοδο."
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
            (sum, expense) =>
                sum +
                Number(
                    expense.amount || 0
                ),
            0
        );

    const categoryTotals = {};

    list.forEach(
        expense => {

            const category =
                expense.category ||
                "Χωρίς κατηγορία";

            categoryTotals[category] =
                (
                    categoryTotals[category] ||
                    0
                ) +
                Number(
                    expense.amount || 0
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
                    <td>${escapeHtml(category)}</td>
                    <td>${formatMoney(amount)}</td>
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
                            String(b.time || "")
                        )
            )
            .map(
                expense =>
                    `
                    <tr>

                        <td>
                            ${escapeHtml(
                                formatDate(
                                    expense.date
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.time || ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.category || ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.paymentMethod || ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.person || ""
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                expense.amount
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

<title>Daily Expenses Report</title>

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
    border: 1px solid #d1d5db;
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
    border: 1px solid #d1d5db;
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

<h1>Daily Expenses</h1>

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
        Αριθμός εξόδων
        <strong>${list.length}</strong>
    </div>

    <div class="box">
        Σύνολο
        <strong>${formatMoney(total)}</strong>
    </div>

    <div class="box">
        Μέσο έξοδο
        <strong>
            ${formatMoney(
                total / list.length
            )}
        </strong>
    </div>

</div>

<h2>Ανάλυση ανά κατηγορία</h2>

<table>

<thead>
<tr>
    <th>Κατηγορία</th>
    <th>Ποσό</th>
</tr>
</thead>

<tbody>
${categoryRows}
</tbody>

</table>

<h2>Αναλυτικά έξοδα</h2>

<table>

<thead>
<tr>
    <th>Ημερομηνία</th>
    <th>Ώρα</th>
    <th>Κατηγορία</th>
    <th>Πληρωμή</th>
    <th>Για ποιον</th>
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


/* ============================================================
   INITIALIZATION
   ============================================================ */

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
                event.key === "Escape"
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


    if ($("addExpenseButton")) {
        $("addExpenseButton")
            .addEventListener(
                "click",
                createExpense
            );
    }


    if ($("category")) {
        $("category")
            .addEventListener(
                "change",
                updateCategoryFields
            );
    }


    if ($("vehicleType")) {
        $("vehicleType")
            .addEventListener(
                "change",
                updateVehicleSelection
            );
    }


    if ($("purchaseMethod")) {
        $("purchaseMethod")
            .addEventListener(
                "change",
                updatePurchaseMethodFields
            );
    }


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


    [
        ["newPayment", "addPayment"],
        ["newCategory", "addCategory"],
        ["newPerson", "addPerson"],
        ["newSubcategory", "addSubcategory"],
        ["newVehicle", "addVehicle"]
    ].forEach(
        function(pair) {

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