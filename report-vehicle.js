"use strict";

(() => {

    const $ = (id) => document.getElementById(id);


    function vehicleLabel(vehicle) {

        if (!vehicle) {
            return "";
        }

        const parts = [];

        if (vehicle.type) {
            parts.push(vehicle.type);
        }

        if (vehicle.make) {
            parts.push(vehicle.make);
        }

        if (vehicle.model) {
            parts.push(vehicle.model);
        }

        if (vehicle.plate) {
            parts.push("(" + vehicle.plate + ")");
        }

        return parts.join(" ").trim();
    }


    function getVehicles() {

        if (
            typeof settings !== "undefined" &&
            Array.isArray(settings.vehicles)
        ) {
            return settings.vehicles;
        }

        return [];
    }


    function populateVehicleSelect() {

        const select =
            $("reportVehicle");

        if (!select) {
            return;
        }

        const current =
            select.value;

        select.innerHTML = "";


        const all =
            document.createElement(
                "option"
            );

        all.value = "all";

        all.textContent =
            "Όλα τα οχήματα";

        select.appendChild(all);


        getVehicles().forEach(
            function(vehicle) {

                const label =
                    vehicleLabel(vehicle);

                if (!label) {
                    return;
                }


                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    label;

                option.textContent =
                    label;

                select.appendChild(
                    option
                );

            }
        );


        const exists =
            Array.from(
                select.options
            ).some(
                function(option) {

                    return (
                        option.value ===
                        current
                    );

                }
            );


        select.value =
            exists
                ? current
                : "all";
    }


    function updateVehicleVisibility() {

        const category =
            $("reportCategory");

        const vehicleWrap =
            $("reportVehicleWrap");

        const expenseWrap =
            $("reportVehicleExpenseWrap");


        const isVehicle =
            category &&
            category.value ===
            "Οχήματα";


        if (vehicleWrap) {

            vehicleWrap.classList.toggle(
                "hidden",
                !isVehicle
            );

        }


        if (expenseWrap) {

            expenseWrap.classList.toggle(
                "hidden",
                !isVehicle
            );

        }


        if (isVehicle) {

            populateVehicleSelect();

        }

    }


    function installVehicleFilter() {

        if (
            typeof window.getFilteredExpenses !==
            "function"
        ) {
            return;
        }


        if (
            window.__dailyExpensesVehicleFilterInstalled
        ) {
            return;
        }


        const original =
            window.getFilteredExpenses;


        window.getFilteredExpenses =
            function() {

                let list =
                    original.apply(
                        this,
                        arguments
                    ) || [];


                const category =
                    $("reportCategory");

                const vehicle =
                    $("reportVehicle");

                const expenseType =
                    $("reportVehicleExpense");


                if (
                    category &&
                    category.value ===
                    "Οχήματα"
                ) {


                    if (
                        vehicle &&
                        vehicle.value &&
                        vehicle.value !==
                        "all"
                    ) {

                        list =
                            list.filter(
                                function(item) {

                                    return (
                                        item.vehicle ===
                                        vehicle.value
                                    );

                                }
                            );

                    }


                    if (
                        expenseType &&
                        expenseType.value &&
                        expenseType.value !==
                        "all"
                    ) {

                        list =
                            list.filter(
                                function(item) {

                                    return (
                                        item.vehicleExpenseType ===
                                        expenseType.value
                                    );

                                }
                            );

                    }

                }


                return list;

            };


        window.__dailyExpensesVehicleFilterInstalled =
            true;
    }


    function init() {

        populateVehicleSelect();

        updateVehicleVisibility();

        installVehicleFilter();


        const category =
            $("reportCategory");


        const vehicle =
            $("reportVehicle");


        if (category) {

            category.addEventListener(
                "change",
                updateVehicleVisibility
            );

        }


        if (vehicle) {

            vehicle.addEventListener(
                "change",
                installVehicleFilter
            );

        }

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();