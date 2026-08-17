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

    function createEditDateTimeFields() {

        if (get("expenseEditDateTime")) {
            return;
        }


        const button =
            get("addExpenseButton");


        if (!button) {
            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.id =
            "expenseEditDateTime";


        wrapper.className =
            "grid hidden";


        wrapper.style.marginTop =
            "12px";


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

    function showEditDateTime(id) {

        const item =
            expenses.find(
                function (expense) {
                    return expense.id === id;
                }
            );


        if (!item) {
            return;
        }


        createEditDateTimeFields();


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
            item.date || today();


        timeInput.value =
            item.time || nowTime();


        wrapper.classList.remove(
            "hidden"
        );
    }


    /* =====================================================
       ΑΠΟΚΡΥΨΗ
       ===================================================== */

    function hideEditDateTime() {

        const wrapper =
            get("expenseEditDateTime");


        if (wrapper) {

            wrapper.classList.add(
                "hidden"
            );

        }
    }


    /* =====================================================
       ΠΑΡΑΚΟΛΟΥΘΗΣΗ ΤΟΥ EDIT
       ===================================================== */

    function watchEditButton() {

        const list =
            get("expenseList");


        if (!list) {
            return;
        }


        list.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-edit]"
                    );


                if (!button) {
                    return;
                }


                const id =
                    button.getAttribute(
                        "data-edit"
                    );


                /*
                 * Το app.js έχει ήδη εκτελέσει
                 * την κανονική editExpense().
                 *
                 * Εμείς απλώς εμφανίζουμε
                 * τα δύο επιπλέον πεδία.
                 */

                setTimeout(
                    function () {

                        showEditDateTime(id);

                    },
                    0
                );

            }
        );
    }


    /* =====================================================
       ΑΝΤΙΚΑΤΑΣΤΑΣΗ SAVE BUTTON
       ===================================================== */

    function setupSaveButton() {

        const button =
            get("addExpenseButton");


        if (!button) {
            return;
        }


        const newButton =
            button.cloneNode(true);


        button.replaceWith(
            newButton
        );


        newButton.addEventListener(
            "click",
            function () {

                /*
                 * ΝΕΑ ΠΛΗΡΩΜΗ
                 *
                 * Δεν αλλάζουμε τίποτα.
                 */

                if (!editingExpenseId) {

                    saveExpense();

                    return;
                }


                /*
                 * ΕΠΕΞΕΡΓΑΣΙΑ
                 */

                const item =
                    expenses.find(
                        function (expense) {

                            return (
                                expense.id ===
                                editingExpenseId
                            );

                        }
                    );


                if (!item) {
                    return;
                }


                const dateInput =
                    get("expenseEditDate");


                const timeInput =
                    get("expenseEditTime");


                const newDate =
                    dateInput &&
                    dateInput.value
                        ? dateInput.value
                        : item.date;


                const newTime =
                    timeInput &&
                    timeInput.value
                        ? timeInput.value
                        : item.time;


                /*
                 * Αποθηκεύουμε προσωρινά
                 * τις νέες τιμές στο record.
                 */

                item.date =
                    newDate;


                item.time =
                    newTime;


                /*
                 * Το selectedDate ακολουθεί
                 * τη νέα ημερομηνία.
                 */

                if (get("selectedDate")) {

                    get("selectedDate").value =
                        newDate;

                }


                /*
                 * Καλούμε την υπάρχουσα
                 * saveExpense() του app.js.
                 */

                saveExpense();


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

            createEditDateTimeFields();

            watchEditButton();

            setupSaveButton();

        }
    );

})();