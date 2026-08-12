/* =========================================================
   DAILY EXPENSES
   reports.js
   Επέκταση Reports
   ========================================================= */

"use strict";

(() => {

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (id) =>
        document.getElementById(id);


    function esc(value) {

        if (
            typeof escapeHTML ===
            "function"
        ) {

            return escapeHTML(
                value
            );

        }

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;
    }


    function moneyReport(value) {

        if (
            typeof money ===
            "function"
        ) {

            return money(
                value
            );

        }

        return (
            Number(
                value || 0
            ).toLocaleString(
                "el-GR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) +
            " €"
        );
    }


    function numberReport(value) {

        if (
            typeof number ===
            "function"
        ) {

            return number(
                value
            );

        }

        return Number(
            value || 0
        ).toLocaleString(
            "el-GR"
        );
    }


    function dateReport(value) {

        if (
            typeof formatDate ===
            "function"
        ) {

            return formatDate(
                value
            );

        }

        return value || "";
    }


    /* =====================================================
       ADDITIONAL REPORT CHECKBOXES
       ===================================================== */

    function addReportOption(
        id,
        text,
        vehicleOnly = false
    ) {

        if ($(id)) {
            return;
        }


        const container =
            document.querySelector(
                ".report-options"
            );


        if (!container) {
            return;
        }


        const label =
            document.createElement(
                "label"
            );


        label.className =
            "check-option";


        if (vehicleOnly) {

            label.classList.add(
                "vehicle-report-option"
            );

            label.classList.add(
                "hidden"
            );

        }


        label.innerHTML = `

            <input
                type="checkbox"
                id="${id}">

            ${text}

        `;


        container.appendChild(
            label
        );
    }


    function addAdditionalReportOptions() {

        const container =
            document.querySelector(
                ".report-options"
            );


        if (!container) {
            return;
        }


        if (
            container.dataset
                .extendedReports ===
            "true"
        ) {

            return;

        }


        container.dataset
            .extendedReports =
            "true";


        /*
         * Γενικά Reports
         */

        addReportOption(
            "reportShowPersons",
            "Σύνολα ανά πρόσωπο"
        );


        addReportOption(
            "reportShowDays",
            "Σύνολα ανά ημέρα"
        );


        addReportOption(
            "reportShowPaymentsSummary",
            "Σύνολα ανά τρόπο πληρωμής"
        );


        /*
         * Reports Οχημάτων
         */

        addReportOption(
            "reportShowVehicleFuel",
            "Κόστος καυσίμων ανά όχημα",
            true
        );


        addReportOption(
            "reportShowVehicleMaintenance",
            "Κόστος συντήρησης ανά όχημα",
            true
        );


        updateVehicleReportOptions();

    }


    /* =====================================================
       VEHICLE-ONLY OPTIONS
       ===================================================== */

    function updateVehicleReportOptions() {

        const category =
            $("reportCategory")
                ? $("reportCategory").value
                : "all";


        const isVehicle =
            category === "Οχήματα";


        document
            .querySelectorAll(
                ".vehicle-report-option"
            )
            .forEach(
                function(element) {

                    /*
                     * Δεν πειράζουμε τα υπάρχοντα
                     * vehicle-report-option.
                     *
                     * Όλα εμφανίζονται μόνο
                     * όταν η κατηγορία είναι
                     * Οχήματα.
                     */

                    element.classList.toggle(
                        "hidden",
                        !isVehicle
                    );

                }
            );


        if (!isVehicle) {

            const optionalVehicleChecks = [

                "reportShowVehicles",
                "reportShowOdometer",
                "reportShowCostPerKm",
                "reportShowTotalVehicleCost",
                "reportShowVehicleFuel",
                "reportShowVehicleMaintenance"

            ];


            optionalVehicleChecks
                .forEach(
                    function(id) {

                        if ($(id)) {

                            $(id).checked =
                                false;

                        }

                    }
                );

        }

    }


    /* =====================================================
       GROUPING
       ===================================================== */

    function groupTotals(
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
                        result[key] ||
                        0
                    ) +
                    Number(
                        item.amount ||
                        0
                    );

            }
        );


        return result;
    }


    /* =====================================================
       VEHICLE EXPENSE GROUPING
       ===================================================== */

    function groupVehicleExpense(
        list,
        expenseType
    ) {

        const result = {};


        list.forEach(
            function(item) {

                if (
                    item.category !==
                    "Οχήματα"
                ) {

                    return;

                }


                if (
                    item.vehicleExpenseType !==
                    expenseType
                ) {

                    return;

                }


                const vehicle =
                    item.vehicle ||
                    "Χωρίς όχημα";


                result[vehicle] =
                    (
                        result[vehicle] ||
                        0
                    ) +
                    Number(
                        item.amount ||
                        0
                    );

            }
        );


        return result;
    }


    /* =====================================================
       REPORT TABLE
       ===================================================== */

    function reportTable(
        title,
        headers,
        rows
    ) {

        let html = `

            <h2>
                ${title}
            </h2>

            <table>

                <thead>

                    <tr>

        `;


        headers.forEach(
            function(header) {

                html += `
                    <th>
                        ${header}
                    </th>
                `;

            }
        );


        html += `

                    </tr>

                </thead>

                <tbody>

        `;


        rows.forEach(
            function(row) {

                html += `
                    <tr>
                `;


                row.forEach(
                    function(cell) {

                        html += `
                            <td>
                                ${cell}
                            </td>
                        `;

                    }
                );


                html += `
                    </tr>
                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        return html;
    }


    /* =====================================================
       EXTENDED REPORT
       ===================================================== */

    function createExtendedReport(
        list
    ) {

        const category =
            $("reportCategory")
                ? $("reportCategory").value
                : "all";


        const dates =
            typeof getReportDates ===
            "function"
                ? getReportDates()
                : {
                    start: "",
                    end: ""
                };


        const total =
            list.reduce(
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


        let html = `

<!DOCTYPE html>

<html lang="el">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width,
               initial-scale=1.0">

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
        #111827;

}


h1 {

    text-align:
        center;

}


h2 {

    margin-top:
        30px;

}


table {

    width:
        100%;

    border-collapse:
        collapse;

    margin-top:
        12px;

}


th,
td {

    border:
        1px solid
        #d1d5db;

    padding:
        8px;

    text-align:
        left;

}


th {

    background:
        #f3f4f6;

}


.total {

    font-size:
        20px;

    font-weight:
        bold;

}


@media print {

    body {

        margin:
            15mm;

    }

    tr {

        page-break-inside:
            avoid;

    }

}

</style>

</head>

<body>

<h1>
Daily Expenses
</h1>

<p>
Περίοδος:
${dateReport(dates.start)}
-
${dateReport(dates.end)}
</p>

<p>
Κατηγορία:
${
    category === "all"
        ? "Όλες"
        : esc(category)
}
</p>

<p class="total">
Σύνολο:
${moneyReport(total)}
</p>

        `;


        /* =================================================
           ΑΝΑΛΥΤΙΚΕΣ ΠΛΗΡΩΜΕΣ
           ================================================= */

        if (
            $("reportShowPayments") &&
            $("reportShowPayments").checked
        ) {

            const rows =
                list.map(
                    function(item) {

                        return [

                            dateReport(
                                item.date
                            ),

                            esc(
                                item.time
                            ),

                            esc(
                                item.category
                            ),

                            esc(
                                item.subcategory ||
                                item.vehicleExpenseType ||
                                ""
                            ),

                            esc(
                                item.person
                            ),

                            esc(
                                item.paymentMethod
                            ),

                            esc(
                                item.vehicle
                            ),

                            (
                                item.odometer !==
                                    null &&
                                item.odometer !==
                                    undefined &&
                                item.odometer !==
                                    ""
                            )
                                ? numberReport(
                                    item.odometer
                                ) +
                                  " km"
                                : "",

                            moneyReport(
                                item.amount
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Αναλυτικές πληρωμές",

                    [
                        "Ημερομηνία",
                        "Ώρα",
                        "Κατηγορία",
                        "Υποκατηγορία / Δαπάνη",
                        "Για ποιον",
                        "Πληρωμή",
                        "Όχημα",
                        "Κοντέρ",
                        "Ποσό"
                    ],

                    rows
                );

        }


        /* =================================================
           ΣΥΝΟΛΑ ΑΝΑ ΚΑΤΗΓΟΡΙΑ
           ================================================= */

        if (
            $("reportShowCategories") &&
            $("reportShowCategories").checked
        ) {

            const groups =
                groupTotals(
                    list,
                    "category"
                );


            const rows =
                Object.keys(
                    groups
                ).map(
                    function(key) {

                        return [

                            esc(key),

                            moneyReport(
                                groups[key]
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Σύνολα ανά κατηγορία",

                    [
                        "Κατηγορία",
                        "Σύνολο"
                    ],

                    rows
                );

        }


        /* =================================================
           ΣΥΝΟΛΑ ΑΝΑ ΥΠΟΚΑΤΗΓΟΡΙΑ
           ================================================= */

        if (
            $("reportShowSubcategories") &&
            $("reportShowSubcategories").checked
        ) {

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
                            item.amount ||
                            0
                        );

                }
            );


            const rows =
                Object.keys(
                    groups
                ).map(
                    function(key) {

                        return [

                            esc(key),

                            moneyReport(
                                groups[key]
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Σύνολα ανά υποκατηγορία",

                    [
                        "Υποκατηγορία",
                        "Σύνολο"
                    ],

                    rows
                );

        }


        /* =================================================
           ΣΥΝΟΛΑ ΑΝΑ ΠΡΟΣΩΠΟ
           ================================================= */

        if (
            $("reportShowPersons") &&
            $("reportShowPersons").checked
        ) {

            const groups =
                groupTotals(
                    list,
                    "person"
                );


            const rows =
                Object.keys(
                    groups
                ).map(
                    function(key) {

                        return [

                            esc(key),

                            moneyReport(
                                groups[key]
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Σύνολα ανά πρόσωπο",

                    [
                        "Πρόσωπο",
                        "Σύνολο"
                    ],

                    rows
                );

        }


        /* =================================================
           ΣΥΝΟΛΑ ΑΝΑ ΗΜΕΡΑ
           ================================================= */

        if (
            $("reportShowDays") &&
            $("reportShowDays").checked
        ) {

            const groups =
                groupTotals(
                    list,
                    "date"
                );


            const rows =
                Object.keys(
                    groups
                )
                .sort()
                .map(
                    function(key) {

                        return [

                            dateReport(
                                key
                            ),

                            moneyReport(
                                groups[key]
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Σύνολα ανά ημέρα",

                    [
                        "Ημερομηνία",
                        "Σύνολο"
                    ],

                    rows
                );

        }


        /* =================================================
           ΣΥΝΟΛΑ ΑΝΑ ΤΡΟΠΟ ΠΛΗΡΩΜΗΣ
           ================================================= */

        if (
            $("reportShowPaymentsSummary") &&
            $("reportShowPaymentsSummary").checked
        ) {

            const groups =
                groupTotals(
                    list,
                    "paymentMethod"
                );


            const rows =
                Object.keys(
                    groups
                ).map(
                    function(key) {

                        return [

                            esc(key),

                            moneyReport(
                                groups[key]
                            )

                        ];

                    }
                );


            html +=
                reportTable(
                    "Σύνολα ανά τρόπο πληρωμής",

                    [
                        "Τρόπος πληρωμής",
                        "Σύνολο"
                    ],

                    rows
                );

        }


        /* =================================================
           REPORTS ΟΧΗΜΑΤΩΝ
           ================================================= */

        if (
            category === "Οχήματα"
        ) {


            /* ---------------------------------------------
               ΣΥΝΟΛΑ ΑΝΑ ΟΧΗΜΑ
               --------------------------------------------- */

            if (
                $("reportShowVehicles") &&
                $("reportShowVehicles").checked
            ) {

                const groups =
                    groupTotals(
                        list,
                        "vehicle"
                    );


                const rows =
                    Object.keys(
                        groups
                    ).map(
                        function(key) {

                            return [

                                esc(key),

                                moneyReport(
                                    groups[key]
                                )

                            ];

                        }
                    );


                html +=
                    reportTable(
                        "Σύνολα ανά όχημα",

                        [
                            "Όχημα",
                            "Σύνολο"
                        ],

                        rows
                    );

            }


            /* ---------------------------------------------
               ΚΑΥΣΙΜΑ
               --------------------------------------------- */

            if (
                $("reportShowVehicleFuel") &&
                $("reportShowVehicleFuel").checked
            ) {

                const groups =
                    groupVehicleExpense(
                        list,
                        "Βενζίνη"
                    );


                const rows =
                    Object.keys(
                        groups
                    ).map(
                        function(key) {

                            return [

                                esc(key),

                                moneyReport(
                                    groups[key]
                                )

                            ];

                        }
                    );


                html +=
                    reportTable(
                        "Κόστος καυσίμων ανά όχημα",

                        [
                            "Όχημα",
                            "Καύσιμα"
                        ],

                        rows
                    );

            }


            /* ---------------------------------------------
               ΣΥΝΤΗΡΗΣΗ
               --------------------------------------------- */

            if (
                $("reportShowVehicleMaintenance") &&
                $("reportShowVehicleMaintenance").checked
            ) {

                const groups =
                    groupVehicleExpense(
                        list,
                        "Έξοδα συντήρησης"
                    );


                const rows =
                    Object.keys(
                        groups
                    ).map(
                        function(key) {

                            return [

                                esc(key),

                                moneyReport(
                                    groups[key]
                                )

                            ];

                        }
                    );


                html +=
                    reportTable(
                        "Κόστος συντήρησης ανά όχημα",

                        [
                            "Όχημα",
                            "Συντήρηση"
                        ],

                        rows
                    );

            }


            /* ---------------------------------------------
               ΚΟΝΤΕΡ
               --------------------------------------------- */

            if (
                $("reportShowOdometer") &&
                $("reportShowOdometer").checked
            ) {

                const records =
                    list
                    .filter(
                        function(item) {

                            return (

                                item.odometer !==
                                    null &&

                                item.odometer !==
                                    undefined &&

                                item.odometer !==
                                    ""

                            );

                        }
                    )
                    .sort(
                        function(a, b) {

                            return String(
                                a.date
                            ).localeCompare(
                                String(
                                    b.date
                                )
                            );

                        }
                    );


                const rows =
                    records.map(
                        function(item) {

                            return [

                                dateReport(
                                    item.date
                                ),

                                esc(
                                    item.vehicle
                                ),

                                numberReport(
                                    item.odometer
                                ) +
                                " km"

                            ];

                        }
                    );


                html +=
                    reportTable(
                        "Χιλιόμετρα / κοντέρ",

                        [
                            "Ημερομηνία",
                            "Όχημα",
                            "Κοντέρ"
                        ],

                        rows
                    );

            }


            /* ---------------------------------------------
               ΚΟΣΤΟΣ / KM
               --------------------------------------------- */

            if (
                (
                    $("reportShowCostPerKm") &&
                    $("reportShowCostPerKm").checked
                ) ||
                (
                    $("reportShowTotalVehicleCost") &&
                    $("reportShowTotalVehicleCost").checked
                )
            ) {

                if (
                    typeof calculateVehicleCostPerKm ===
                    "function"
                ) {

                    const calculations =
                        calculateVehicleCostPerKm(
                            list
                        );


                    const rows =
                        calculations.map(
                            function(item) {

                                return [

                                    esc(
                                        item.vehicle
                                    ),

                                    numberReport(
                                        item.firstOdometer
                                    ),

                                    numberReport(
                                        item.lastOdometer
                                    ),

                                    numberReport(
                                        item.kilometers
                                    ),

                                    (
                                        $("reportShowTotalVehicleCost") &&
                                        $("reportShowTotalVehicleCost").checked
                                    )
                                        ? moneyReport(
                                            item.total
                                        )
                                        : "",

                                    (
                                        $("reportShowCostPerKm") &&
                                        $("reportShowCostPerKm").checked
                                    )
                                        ? moneyReport(
                                            item.costPerKm
                                        )
                                        : ""

                                ];

                            }
                        );


                    html +=
                        reportTable(

                            "Κόστος οχήματος ανά χιλιόμετρο",

                            [
                                "Όχημα",
                                "Αρχικό κοντέρ",
                                "Τελικό κοντέρ",
                                "Χιλιόμετρα",
                                "Συνολικό κόστος",
                                "Κόστος / km"
                            ],

                            rows

                        );

                }

            }

        }


        html += `

</body>

</html>

        `;


        return html;

    }


    /* =====================================================
       GENERATE REPORT
       ===================================================== */

    function generateExtendedReport() {

        if (
            typeof getFilteredExpenses !==
            "function"
        ) {

            alert(
                "Δεν είναι διαθέσιμη η λειτουργία Reports."
            );

            return;

        }


        const list =
            getFilteredExpenses();


        if (
            list.length === 0
        ) {

            alert(
                "Δεν υπάρχουν πληρωμές για τα επιλεγμένα κριτήρια."
            );

            return;

        }


        const html =
            createExtendedReport(
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


        link.href =
            url;


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


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeReports() {

        addAdditionalReportOptions();


        /*
         * Τα τρία βασικά παραμένουν
         * πάντα προεπιλεγμένα.
         */

        if (
            $("reportShowPayments")
        ) {

            $("reportShowPayments")
                .checked = true;

        }


        if (
            $("reportShowCategories")
        ) {

            $("reportShowCategories")
                .checked = true;

        }


        if (
            $("reportShowSubcategories")
        ) {

            $("reportShowSubcategories")
                .checked = true;

        }


        updateVehicleReportOptions();


        const category =
            $("reportCategory");


        if (category) {

            category.addEventListener(
                "change",
                updateVehicleReportOptions
            );

        }


        const button =
            $("generateReportButton");


        if (button) {

            /*
             * Σταματάμε τον παλιό
             * handler του app.js και
             * χρησιμοποιούμε τον νέο.
             */

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopImmediatePropagation();

                    generateExtendedReport();

                },
                true
            );

        }

    }


    /*
     * Το app.js φορτώνεται πριν από
     * αυτό το αρχείο.
     *
     * Περιμένουμε να ολοκληρωθεί
     * το DOM.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeReports
        );

    } else {

        initializeReports();

    }

})();