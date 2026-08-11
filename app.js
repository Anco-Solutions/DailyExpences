// ======================================================
// DAILY EXPENSES V2
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
// LOAD DATA
// ======================================================

function loadJSON(key, fallback) {

    try {

        const data =
            localStorage.getItem(key);

        if (data) {

            return JSON.parse(data);

        }

    } catch (error) {

        console.error(error);

    }

    return JSON.parse(
        JSON.stringify(fallback)
    );

}


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
// SAVE
// ======================================================

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


// ======================================================
// HELPERS
// ======================================================

function $(id) {

    return document.getElementById(id);

}


function pad(number) {

    return String(number)
        .padStart(2, "0");

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

    return Number(value || 0)
        .toLocaleString(
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
        text || "";

    return div.innerHTML;

}


// ======================================================
// SELECT OPTIONS
// ======================================================

function fillSelect(
    select,
    items,
    allText = null
) {

    select.innerHTML = "";

    if (allText !== null) {

        const option =
            document.createElement("option");

        option.value = "all";
        option.textContent = allText;

        select.appendChild(option);

    }


    items.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item;
        option.textContent = item;

        select.appendChild(option);

    });

}


// ======================================================
// REFRESH SELECTS
// ======================================================

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

    const category =
        $("category").value;


    const isFuel =
        category === "Βενζίνη";


    const isVehicle =
        category === "Βενζίνη" ||
        category === "Συντήρηση οχήματος";


    const isShopping =
        category === "Αγορές";


    $("vehicleWrap")
        .classList
        .toggle(
            "hidden",
            !isVehicle
        );


    $("litersWrap")
        .classList
        .toggle(
            "hidden",
            !isFuel
        );


    $("odometerWrap")
        .classList
        .toggle(
            "hidden",
            !isFuel
        );


    $("subcategoryWrap")
        .classList
        .toggle(
            "hidden",
            !isShopping
        );


    const internet =
        $("purchaseMethod").value ===
        "internet";


    $("orderWrap")
        .classList
        .toggle(
            "hidden",
            !internet
        );


    $("orderStatusWrap")
        .classList
        .toggle(
            "hidden",
            !internet
        );

}


$("category")
    .addEventListener(
        "change",
        updateConditionalFields
    );


$("purchaseMethod")
    .addEventListener(
        "change",
        updateConditionalFields
    );


// ======================================================
// ADD EXPENSE
// ======================================================

function addExpense() {

    const amount =
        Number(
            $("amount").value
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
        $("category").value;


    const isFuel =
        category === "Βενζίνη";


    const isInternet =
        $("purchaseMethod").value ===
        "internet";


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
            $("description")
                .value
                .trim()

    };


    expenses.push(expense);

    saveExpenses();


    clearForm();


    $("selectedDate").value =
        expense.date;


    renderDay(
        expense.date
    );


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


    $("purchaseMethod").value =
        "store";


    $("category").selectedIndex =
        0;


    $("paymentMethod").selectedIndex =
        0;


    $("person").selectedIndex =
        0;


    updateConditionalFields();

}


$("addExpenseButton")
    .addEventListener(
        "click",
        addExpense
    );


// ======================================================
// RENDER DAY
// ======================================================

function renderDay(date) {

    const list =
        expenses
            .filter(
                expense =>
                    expense.date === date
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


    list.forEach(expense => {

        total += expense.amount;


        if (
            expense.payment ===
            "Κάρτα"
        ) {

            card +=
                expense.amount;

        }


        if (
            expense.payment ===
            "Μετρητά"
        ) {

            cash +=
                expense.amount;

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

        $("expenseList").innerHTML =
            `
            <p class="muted">
                Δεν υπάρχουν έξοδα
                για αυτή την ημέρα.
            </p>
            `;

        return;

    }


    $("expenseList").innerHTML =
        list
            .map(expense => {

                let details =
                    `${expense.time} — ` +
                    `${escapeHtml(
                        expense.payment
                    )} — ` +
                    `${escapeHtml(
                        expense.category
                    )} — ` +
                    `${escapeHtml(
                        expense.person
                    )}`;


                if (
                    expense.subcategory
                ) {

                    details +=
                        ` — ${
                            escapeHtml(
                                expense.subcategory
                            )
                        }`;

                }


                if (
                    expense.vehicle
                ) {

                    details +=
                        ` — ${
                            escapeHtml(
                                expense.vehicle
                            )
                        }`;

                }


                if (
                    expense.liters
                ) {

                    details +=
                        ` — ${
                            expense.liters
                        } L`;

                }


                if (
                    expense.odometer
                ) {

                    details +=
                        ` — ${
                            expense.odometer
                        } km`;

                }


                if (
                    expense.purchaseMethod ===
                    "internet"
                ) {

                    details +=
                        " — Internet";


                    if (
                        expense.shop
                    ) {

                        details +=
                            ` — ${
                                escapeHtml(
                                    expense.shop
                                )
                            }`;

                    }


                    if (
                        expense.orderNumber
                    ) {

                        details +=
                            ` — #${
                                escapeHtml(
                                    expense.orderNumber
                                )
                            }`;

                    }

                } else if (
                    expense.shop
                ) {

                    details +=
                        ` — ${
                            escapeHtml(
                                expense.shop
                            )
                        }`;

                }


                if (
                    expense.description
                ) {

                    details +=
                        ` — ${
                            escapeHtml(
                                expense.description
                            )
                        }`;

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

                    </div>

                `;

            })
            .join("");

}


$("selectedDate")
    .addEventListener(
        "change",
        event =>
            renderDay(
                event.target.value
            )
    );


// ======================================================
// REPORT DATES
// ======================================================

function updateReportDates() {

    const todayDate =
        new Date();


    const type =
        $("reportType").value;


    let start =
        new Date(todayDate);


    let end =
        new Date(todayDate);


    if (
        type === "week"
    ) {

        const day =
            todayDate.getDay();


        const difference =
            day === 0
                ? 6
                : day - 1;


        start.setDate(
            todayDate.getDate() -
            difference
        );


        end =
            new Date(start);


        end.setDate(
            start.getDate() + 6
        );

    }


    if (
        type === "month"
    ) {

        start =
            new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                1
            );


        end =
            new Date(
                todayDate.getFullYear(),
                todayDate.getMonth() + 1,
                0
            );

    }


    if (
        type === "year"
    ) {

        start =
            new Date(
                todayDate.getFullYear(),
                0,
                1
            );


        end =
            new Date(
                todayDate.getFullYear(),
                11,
                31
            );

    }


    if (
        type !== "custom"
    ) {

        $("reportStartDate").value =
            start.getFullYear() +
            "-" +
            pad(
                start.getMonth() + 1
            ) +
            "-" +
            pad(
                start.getDate()
            );


        $("reportEndDate").value =
            end.getFullYear() +
            "-" +
            pad(
                end.getMonth() + 1
            ) +
            "-" +
            pad(
                end.getDate()
            );

    }

}


$("reportType")
    .addEventListener(
        "change",
        updateReportDates
    );


// ======================================================
// FILTER REPORT
// ======================================================

function getFilteredExpenses() {

    const start =
        $("reportStartDate").value;


    const end =
        $("reportEndDate").value;


    let list =
        expenses.filter(
            expense =>
                expense.date >= start &&
                expense.date <= end
        );


    if (
        $("reportCategory").value !==
        "all"
    ) {

        list =
            list.filter(
                expense =>
                    expense.category ===
                    $("reportCategory").value
            );

    }


    if (
        $("reportPerson").value !==
        "all"
    ) {

        list =
            list.filter(
                expense =>
                    expense.person ===
                    $("reportPerson").value
            );

    }


    if (
        $("reportPayment").value !==
        "all"
    ) {

        list =
            list.filter(
                expense =>
                    expense.payment ===
                    $("reportPayment").value
            );

    }


    return list.sort(
        (a, b) =>
            (
                a.date +
                " " +
                a.time
            ).localeCompare(
                b.date +
                " " +
                b.time
            )
    );

}


// ======================================================
// LOAD jsPDF
// ======================================================

function loadJsPDF() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.jspdf
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";


            script.onload =
                resolve;


            script.onerror =
                reject;


            document.head.appendChild(
                script
            );

        }
    );

}


// ======================================================
// GENERATE PDF
// ======================================================

async function generatePDF() {

    const list =
        getFilteredExpenses();


    if (!list.length) {

        alert(
            "Δεν υπάρχουν έξοδα " +
            "για τα συγκεκριμένα φίλτρα."
        );

        return;

    }


    try {

        await loadJsPDF();

    } catch (error) {

        alert(
            "Δεν ήταν δυνατή " +
            "η φόρτωση του PDF."
        );

        return;

    }


    const {
        jsPDF
    } =
        window.jspdf;


    const doc =
        new jsPDF();


    // ==================================================
    // GREEK FONT
    // ==================================================

    try {

        const response =
            await fetch(
                "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
            );


        const buffer =
            await response.arrayBuffer();


        const bytes =
            new Uint8Array(
                buffer
            );


        let binary = "";

        const chunkSize =
            0x8000;


        for (
            let i = 0;
            i < bytes.length;
            i += chunkSize
        ) {

            binary +=
                String.fromCharCode(
                    ...bytes.subarray(
                        i,
                        i + chunkSize
                    )
                );

        }


        const base64 =
            btoa(binary);


        doc.addFileToVFS(
            "NotoSans-Regular.ttf",
            base64
        );


        doc.addFont(
            "NotoSans-Regular.ttf",
            "NotoSans",
            "normal"
        );


        doc.setFont(
            "NotoSans",
            "normal"
        );


    } catch (error) {

        console.warn(
            "Noto Sans font unavailable.",
            error
        );

    }


    // ==================================================
    // TOTAL
    // ==================================================

    const total =
        list.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );


    doc.setFontSize(18);


    doc.text(
        "DAILY EXPENSES",
        20,
        20
    );


    doc.setFontSize(11);


    doc.text(
        `Περίοδος: ${
            formatDate(
                $("reportStartDate").value
            )
        } - ${
            formatDate(
                $("reportEndDate").value
            )
        }`,
        20,
        29
    );


    let y = 42;


    doc.setFontSize(12);


    doc.text(
        `ΣΥΝΟΛΟ: ${formatMoney(total)}`,
        20,
        y
    );


    y += 10;


    // ==================================================
    // PAYMENT TOTALS
    // ==================================================

    const paymentTotals = {};


    list.forEach(expense => {

        if (
            !paymentTotals[
                expense.payment
            ]
        ) {

            paymentTotals[
                expense.payment
            ] = 0;

        }


        paymentTotals[
            expense.payment
        ] += expense.amount;

    });


    doc.setFontSize(12);


    doc.text(
        "ΑΝΑ ΤΡΟΠΟ ΠΛΗΡΩΜΗΣ",
        20,
        y
    );


    y += 7;


    doc.setFontSize(10);


    Object.entries(
        paymentTotals
    ).forEach(
        ([payment, amount]) => {

            if (y > 275) {

                doc.addPage();

                y = 20;

            }


            doc.text(
                `${payment}: ${
                    formatMoney(amount)
                }`,
                20,
                y
            );


            y += 6;

        }
    );


    y += 5;


    // ==================================================
    // DETAILS
    // ==================================================

    doc.setFontSize(12);


    doc.text(
        "ΑΝΑΛΥΤΙΚΕΣ ΕΓΓΡΑΦΕΣ",
        20,
        y
    );


    y += 8;


    doc.setFontSize(9);


    list.forEach(expense => {

        let line =
            `${formatDate(
                expense.date
            )} ${
                expense.time
            } | ${
                formatMoney(
                    expense.amount
                )
            } | ${
                expense.payment
            } | ${
                expense.category
            } | ${
                expense.person
            }`;


        if (
            expense.subcategory
        ) {

            line +=
                ` | ${
                    expense.subcategory
                }`;

        }


        if (
            expense.vehicle
        ) {

            line +=
                ` | ${
                    expense.vehicle
                }`;

        }


        if (
            expense.liters
        ) {

            line +=
                ` | ${
                    expense.liters
                } L`;

        }


        if (
            expense.odometer
        ) {

            line +=
                ` | ${
                    expense.odometer
                } km`;

        }


        if (
            expense.shop
        ) {

            line +=
                ` | ${
                    expense.shop
                }`;

        }


        if (
            expense.orderNumber
        ) {

            line +=
                ` | #${
                    expense.orderNumber
                }`;

        }


        if (
            expense.description
        ) {

            line +=
                ` | ${
                    expense.description
                }`;

        }


        const lines =
            doc.splitTextToSize(
                line,
                170
            );


        if (
            y +
            lines.length * 5 >
            280
        ) {

            doc.addPage();

            y = 20;

        }


        doc.text(
            lines,
            20,
            y
        );


        y +=
            lines.length * 5 + 2;

    });


    // ==================================================
    // SAVE
    // ==================================================

    const filename =
        `Daily-Expenses-${
            $("reportStartDate").value
        }-${
            $("reportEndDate").value
        }.pdf`;


    doc.save(
        filename
    );

}


$("generateReportButton")
    .addEventListener(
        "click",
        generatePDF
    );


// ======================================================
// SETTINGS
// ======================================================

function renderSettingsList(
    containerId,
    key
) {

    const container =
        $(containerId);


    container.innerHTML = "";


    settings[key].forEach(
        (value, index) => {

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


            input.value =
                value;


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.textContent =
                "✏️";


            editButton.className =
                "secondary";


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.className =
                "danger";


            editButton.onclick =
                () => {

                    const newValue =
                        input.value.trim();


                    if (!newValue) {

                        return;

                    }


                    settings[key][index] =
                        newValue;


                    saveSettings();

                    refreshAllSettings();

                };


            deleteButton.onclick =
                () => {

                    if (
                        settings[key].length <= 1
                    ) {

                        alert(
                            "Πρέπει να υπάρχει " +
                            "τουλάχιστον μία επιλογή."
                        );

                        return;

                    }


                    if (
                        !confirm(
                            `Να διαγραφεί "${value}";`
                        )
                    ) {

                        return;

                    }


                    settings[key].splice(
                        index,
                        1
                    );


                    saveSettings();

                    refreshAllSettings();

                };


            row.appendChild(input);

            row.appendChild(
                editButton
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


// ======================================================
// REFRESH SETTINGS
// ======================================================

function refreshAllSettings() {

    refreshSelects();


    renderSettingsList(
        "paymentSettings",
        "payments"
    );


    renderSettingsList(
        "categorySettings",
        "categories"
    );


    renderSettingsList(
        "personSettings",
        "persons"
    );


    renderSettingsList(
        "vehicleSettings",
        "vehicles"
    );


    renderSettingsList(
        "subcategorySettings",
        "subcategories"
    );

}


// ======================================================
// ADD SETTING
// ======================================================

function addSetting(
    inputId,
    key
) {

    const value =
        $(inputId)
            .value
            .trim();


    if (!value) {

        return;

    }


    if (
        !settings[key].includes(
            value
        )
    ) {

        settings[key].push(
            value
        );

    }


    $(inputId).value = "";


    saveSettings();

    refreshAllSettings();

}


$("addPayment")
    .onclick =
    () =>
        addSetting(
            "newPayment",
            "payments"
        );


$("addCategory")
    .onclick =
    () =>
        addSetting(
            "newCategory",
            "categories"
        );


$("addPerson")
    .onclick =
    () =>
        addSetting(
            "newPerson",
            "persons"
        );


$("addVehicle")
    .onclick =
    () =>
        addSetting(
            "newVehicle",
            "vehicles"
        );


$("addSubcategory")
    .onclick =
    () =>
        addSetting(
            "newSubcategory",
            "subcategories"
        );


// ======================================================
// SETTINGS MODAL
// ======================================================

$("settingsButton")
    .onclick =
    () => {

        $("settingsModal")
            .classList
            .remove("hidden");

        refreshAllSettings();

    };


$("closeSettings")
    .onclick =
    () => {

        $("settingsModal")
            .classList
            .add("hidden");

    };


// ======================================================
// EXPORT DATA
// ======================================================

$("exportData")
    .onclick =
    () => {

        const data = {

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


        const link =
            document.createElement(
                "a"
            );


        link.href =
            URL.createObjectURL(
                blob
            );


        link.download =
            "Daily-Expenses-backup.json";


        link.click();


        URL.revokeObjectURL(
            link.href
        );

    };


// ======================================================
// IMPORT DATA
// ======================================================

$("importDataButton")
    .onclick =
    () => {

        $("importData").click();

    };


$("importData")
    .onchange =
    async event => {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        try {

            const data =
                JSON.parse(
                    await file.text()
                );


            if (
                data.settings
            ) {

                settings =
                    data.settings;

            }


            if (
                data.expenses
            ) {

                expenses =
                    data.expenses;

            }


            saveSettings();

            saveExpenses();

            refreshAllSettings();

            renderDay(
                getToday()
            );


            alert(
                "Τα δεδομένα εισήχθησαν."
            );


        } catch (error) {

            alert(
                "Μη έγκυρο αρχείο backup."
            );

        }

    };


// ======================================================
// RESET SETTINGS
// ======================================================

$("resetSettings")
    .onclick =
    () => {

        if (
            !confirm(
                "Να επαναφερθούν οι " +
                "αρχικές παράμετροι; " +
                "Τα έξοδα δεν θα διαγραφούν."
            )
        ) {

            return;

        }


        settings =
            JSON.parse(
                JSON.stringify(
                    defaultSettings
                )
            );


        saveSettings();

        refreshAllSettings();

    };


// ======================================================
// CLOCK
// ======================================================

function updateClock() {

    const date =
        new Date();


    $("currentDateTime")
        .textContent =
        `${pad(
            date.getDate()
        )}/${
            pad(
                date.getMonth() + 1
            )
        }/${
            date.getFullYear()
        } — ${
            pad(
                date.getHours()
            )
        }:${
            pad(
                date.getMinutes()
            )
        }:${
            pad(
                date.getSeconds()
            )
        }`;

}


setInterval(
    updateClock,
    1000
);


updateClock();


// ======================================================
// INITIALIZATION
// ======================================================

$("selectedDate").value =
    getToday();


$("reportStartDate").value =
    getToday();


$("reportEndDate").value =
    getToday();


refreshSelects();

refreshAllSettings();

renderDay(
    getToday()
);

updateReportDates();