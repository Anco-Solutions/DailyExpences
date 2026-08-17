/* =========================================================
   DAILY EXPENSES - EDIT DATE/TIME EXTENSION
   Προσθήκη ημερομηνίας και ώρας κατά την επεξεργασία
   ========================================================= */

(function () {
    "use strict";

    function get(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       ΔΗΜΙΟΥΡΓΙΑ ΠΕΔΙΩΝ ΗΜΕΡΟΜΗΝΙΑΣ / ΩΡΑΣ
       ===================================================== */

    function addEditDateTimeFields() {

        if (get("expenseEditDateTime")) {
            return;
        }

        const button = get("addExpenseButton");

        if (!button) {
            return;
        }

        const wrapper = document.createElement("div");

        wrapper.id = "expenseEditDateTime";
        wrapper.className = "grid hidden";
        wrapper.style.marginTop = "12px";

        wrapper.innerHTML = `
            <div>

                <label for="expenseEditDate">
                    Ημερομηνία πληρωμής
                </label>

                <input
                    type="date"
                    id="expenseEditDate">

            </div>


            <div>

                <label for="expenseEditTime">
                    Ώρα πληρωμής
                </label>

                <input
                    type="time"
                    id="expenseEditTime">

            </div>
        `;

        button.parentNode.insertBefore(
            wrapper,
            button
        );
    }


    /* =====================================================
       ΕΜΦΑΝΙΣΗ ΗΜΕΡΟΜΗΝΙΑΣ / ΩΡΑΣ ΣΤΗΝ ΕΠΕΞΕΡΓΑΣΙΑ
       ===================================================== */

    function showEditDateTime(date, time) {

        addEditDateTimeFields();

        const wrapper =
            get("expenseEditDateTime");

        const dateInput =
            get("expenseEditDate");

        const timeInput =
            get("expenseEditTime");


        if (
            !wrapper ||
            !dateInput ||
            !timeInput
        ) {
            return;
        }


        dateInput.value =
            date || today();


        timeInput.value =
            time || nowTime();


        wrapper.classList.remove("hidden");
    }


    /* =====================================================
       ΑΠΟΚΡΥΨΗ
       ===================================================== */

    function hideEditDateTime() {

        const wrapper =
            get("expenseEditDateTime");


        if (wrapper) {

            wrapper.classList.add("hidden");

        }
    }


    /* =====================================================
       ΕΝΕΡΓΟΠΟΙΗΣΗ EDIT MODE
       ===================================================== */

    function installSafeEditMode() {

        addEditDateTimeFields();


        if (typeof editExpense === "function") {

            const originalEditExpense =
                editExpense;


            editExpense = function (id) {

                originalEditExpense(id);


                const item =
                    expenses.find(function (expense) {

                        return expense.id === id;

                    });


                if (!item) {

                    return;

                }


                showEditDateTime(

                    item.date || today(),

                    item.time || nowTime()

                );

            };
        }


        const button =
            get("addExpenseButton");


        if (!button) {

            return;

        }


        /*
         * Δημιουργούμε νέο κουμπί ώστε να
         * αντικατασταθεί ο αρχικός click listener.
         */

        const cleanButton =
            button.cloneNode(true);


        button.replaceWith(
            cleanButton
        );


        cleanButton.addEventListener(
            "click",
            function () {


                /*
                 * ΚΑΝΟΝΙΚΗ ΝΕΑ ΠΛΗΡΩΜΗ
                 *
                 * Δεν αλλάζουμε τίποτα.
                 */

                if (!editingExpenseId) {

                    saveExpense();

                    return;

                }


                /*
                 * ΕΠΕΞΕΡΓΑΣΙΑ ΥΠΑΡΧΟΥΣΑΣ ΠΛΗΡΩΜΗΣ
                 */

                const dateInput =
                    get("expenseEditDate");


                const timeInput =
                    get("expenseEditTime");


                const editDate =
                    dateInput &&
                    dateInput.value
                        ? dateInput.value
                        : "";


                const editTime =
                    timeInput &&
                    timeInput.value
                        ? timeInput.value
                        : "";


                if (!editDate) {

                    alert(
                        "Παρακαλώ επίλεξε ημερομηνία."
                    );

                    return;
                }


                if (!editTime) {

                    alert(
                        "Παρακαλώ επίλεξε ώρα."
                    );

                    return;
                }


                /*
                 * Κρατάμε προσωρινά την αρχική
                 * λειτουργία nowTime().
                 */

                const originalNowTime =
                    nowTime;


                /*
                 * Η ημερομηνία επιλέγεται
                 * από το πεδίο επεξεργασίας.
                 */

                if (get("selectedDate")) {

                    get("selectedDate").value =
                        editDate;

                }


                /*
                 * Κατά την αποθήκευση της
                 * επεξεργασμένης εγγραφής,
                 * δίνουμε την ώρα που επέλεξε
                 * ο χρήστης.
                 */

                nowTime = function () {

                    return editTime;

                };


                try {

                    saveExpense();

                }
                finally {

                    /*
                     * Επαναφέρουμε αμέσως
                     * την κανονική λειτουργία.
                     */

                    nowTime =
                        originalNowTime;

                }


                hideEditDateTime();

            }
        );
    }


    /* =====================================================
       ΕΚΚΙΝΗΣΗ
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            installSafeEditMode();

        }
    );

})();