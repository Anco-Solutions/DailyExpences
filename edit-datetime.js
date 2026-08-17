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
       ΕΜΦΑΝΙΣΗ ΗΜΕΡΟΜΗΝΙΑΣ / ΩΡΑΣ
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
       ΕΠΕΞΕΡΓΑΣΙΑ ΠΛΗΡΩΜΗΣ
       ===================================================== */

    function installEditDateTime() {

        addEditDateTimeFields();


        /*
         * Κρατάμε την αρχική editExpense()
         * του app.js.
         */

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
         * Αφαιρούμε τον αρχικό click listener
         * χωρίς να αλλάξουμε το υπόλοιπο app.js.
         */

        const cleanButton =
            button.cloneNode(true);


        button.replaceWith(cleanButton);


        cleanButton.addEventListener(
            "click",
            function () {


                /*
                 * =================================================
                 * ΝΕΑ ΠΛΗΡΩΜΗ
                 *
                 * Η συμπεριφορά παραμένει ακριβώς ίδια.
                 * Αυτόματα ημερομηνία + ώρα.
                 * =================================================
                 */

                if (!editingExpenseId) {

                    saveExpense();

                    return;
                }


                /*
                 * =================================================
                 * ΕΠΕΞΕΡΓΑΣΙΑ ΥΠΑΡΧΟΥΣΑΣ ΠΛΗΡΩΜΗΣ
                 * =================================================
                 */

                const item =
                    expenses.find(function (expense) {

                        return expense.id === editingExpenseId;

                    });


                if (!item) {
                    return;
                }


                const dateInput =
                    get("expenseEditDate");


                const timeInput =
                    get("expenseEditTime");


                const editDate =
                    dateInput && dateInput.value
                        ? dateInput.value
                        : item.date;


                const editTime =
                    timeInput && timeInput.value
                        ? timeInput.value
                        : item.time;


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
                 * =================================================
                 * ΑΠΟΘΗΚΕΥΟΥΜΕ ΠΡΟΣΩΡΙΝΑ ΤΗΝ ΕΠΙΛΕΓΜΕΝΗ
                 * ΗΜΕΡΟΜΗΝΙΑ ΚΑΙ ΩΡΑ
                 * =================================================
                 */

                const oldDate =
                    item.date;

                const oldTime =
                    item.time;


                item.date =
                    editDate;

                item.time =
                    editTime;


                /*
                 * Το selectedDate ακολουθεί την ημερομηνία
                 * που επέλεξε ο χρήστης.
                 */

                if (get("selectedDate")) {

                    get("selectedDate").value =
                        editDate;
                }


                /*
                 * Καλούμε την κανονική saveExpense()
                 * του app.js.
                 *
                 * Αν κάτι αποτύχει, επαναφέρουμε
                 * την παλιά ημερομηνία/ώρα.
                 */

                try {

                    saveExpense();

                }
                catch (error) {

                    item.date =
                        oldDate;

                    item.time =
                        oldTime;

                    console.error(
                        "Σφάλμα κατά την αποθήκευση:",
                        error
                    );

                    alert(
                        "Παρουσιάστηκε σφάλμα κατά την αποθήκευση."
                    );

                    return;
                }


                /*
                 * Τέλος επεξεργασίας.
                 */

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

            installEditDateTime();

        }
    );

})();