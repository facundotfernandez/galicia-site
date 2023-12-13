import { data as localdata } from "./localdata.js";

function init_ExpensesPage() {

    try {

        const SwitchTheme = document.getElementById("Theme")

        if (SwitchTheme == "light") {
            document.body.className = "light-theme"
        }

        let CardholdersHTMLSection = ""

        localdata.cardholders.forEach((cardholder) => {

            CardholdersHTMLSection += `
                <span class="cardholders-cardholder">
                    <input type="checkbox" class="btn-check" id="btncheck-${cardholder._id}" value="${cardholder.name}">
                    <label class="btn cardholders-cardholder" for="btncheck-${cardholder._id}">${cardholder.name}</label>
                </span>
            `;

        });

        document.getElementById("CardholdersButtons").innerHTML = CardholdersHTMLSection

        const CheckboxGroup = [...document.querySelectorAll("input[class = btn-check")]
        const SearchInput = document.getElementById("SearchInput")

        CheckboxGroup.forEach(checkbox => {

            checkbox.addEventListener("click", update_ExpensesShown)

        });

        SearchInput.addEventListener("keyup", update_ExpensesShown)
        SwitchTheme.addEventListener("click", switch_Theme)

        update_ExpensesShown()

    } catch (error) {

        console.log(error);

    };

};

function switch_Theme() {

    const theme = localStorage.getItem('theme');
    document.body.className == "" ? document.body.className = "light-theme" : document.body.className = ""
    theme == null ? localStorage.setItem("theme", "light") : localStorage.removeItem('theme');

};

function download_CardholderCSV(cardholder_id) {

    const datos = [
        ["Nombre", "Tarjeta", "Fecha", "Hora", "Comprobante", "Movimiento", "Cuit", "Direccion", "Cuotas", "Moneda", "Importe", "ImpuestoPais", "ImpuestoGanancias", "ImpuestoBienesPersonales"]
    ];

    let registro = [];
    let name = "";

    localdata.cardholders.forEach(cardholder => {

        if (cardholder._id == cardholder_id) {

            name = cardholder.name

            cardholder.expenses.forEach(expense => {

                registro.push(cardholder.name)
                registro.push(cardholder.card_number)
                registro.push(expense.date)
                registro.push(expense.time)
                registro.push(expense.receipt)
                registro.push(expense.business)
                registro.push(expense.cuit)
                registro.push(expense.address)
                registro.push(expense.dues)
                registro.push(expense.currency)
                registro.push(expense.amount)
                registro.push((expense.currency === "ARS") ? ("") : ((expense.amount * localdata.dolar) * .3).toFixed(2))
                registro.push((expense.currency === "ARS") ? ("") : (expense.amount * localdata.dolar).toFixed(2))
                registro.push((expense.currency === "ARS") ? ("") : ((expense.amount * localdata.dolar) * .25).toFixed(2))
                datos.push(registro)

                registro = []
            });
        };
    });

    // Crear el contenido CSV
    const contenidoCSV = datos.map(fila => fila.join(",")).join("\n");

    // Crear un objeto Blob con el contenido CSV
    const blob = new Blob([contenidoCSV], { type: "text/csv" });

    // Crear un enlace para descargar el archivo
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = window.URL.createObjectURL(blob);
    enlaceDescarga.download = "resumen_" + name + ".csv";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
};

function download_CompleteCSV() {

    const datos = [
        ["Nombre", "Tarjeta", "Fecha", "Hora", "Comprobante", "Movimiento", "Cuit", "Direccion", "Cuotas", "Moneda", "Importe", "ImpuestoPais", "ImpuestoGanancias", "ImpuestoBienesPersonales"],
    ];

    let registro = [];
    let CheckboxGroupChecked = [...document.querySelectorAll("input[class = btn-check]:checked")].map(cardholder => cardholder.value);
    let SearchInputValue = document.getElementById("SearchInput").value.toLowerCase();

    localdata.cardholders.forEach(cardholder => {

        cardholder.expenses.forEach(expense => {

            if (((CheckboxGroupChecked.length == 0 || CheckboxGroupChecked.includes(cardholder.name))) && (SearchInputValue.length == 0 || (expense.business.toLowerCase()).includes(SearchInputValue))) {

                registro.push(cardholder.name)
                registro.push(cardholder.card_number)
                registro.push(expense.date)
                registro.push(expense.time)
                registro.push(expense.receipt)
                registro.push(expense.business)
                registro.push(expense.cuit)
                registro.push(expense.address)
                registro.push(expense.dues)
                registro.push(expense.currency)
                registro.push(expense.amount)
                registro.push((expense.currency === "ARS") ? ("") : ((expense.amount * localdata.dolar) * .3).toFixed(2))
                registro.push((expense.currency === "ARS") ? ("") : (expense.amount * localdata.dolar).toFixed(2))
                registro.push((expense.currency === "ARS") ? ("") : ((expense.amount * localdata.dolar) * .25).toFixed(2))
                datos.push(registro)

                registro = [];
            };
        });
    });

    // Crear el contenido CSV
    const contenidoCSV = datos.map(fila => fila.join(",")).join("\n");

    // Crear un objeto Blob con el contenido CSV
    const blob = new Blob([contenidoCSV], { type: "text/csv" });

    // Crear un enlace para descargar el archivo
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = window.URL.createObjectURL(blob);
    enlaceDescarga.download = "resumen_completo.csv";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
};

function displayPopup(cardholder_id, expense_id) {

    localdata.cardholders.forEach(cardholder => {

        if (cardholder._id == cardholder_id) {

            cardholder.expenses.forEach(expense => {

                if (expense._id == expense_id) {

                    const toast = document.getElementById("ToastExpense");
                    const toastDetails = document.getElementById("ExpenseDetails");
                    toast.className = "show";

                    toastDetails.innerHTML = `
                        <p><strong>Nombre: </strong>${cardholder.name}</p>
                        <p><strong>Tarjeta: </strong>${cardholder.card_number}</p>
                        <p><strong>Fecha: </strong>${expense.date}</p>
                        <p><strong>Hora: </strong>${expense.time}</p>
                        <p><strong>Comprobante: </strong>${expense.receipt}</p>
                        <p><strong>Establecimiento: </strong>${expense.business}</p>
                        <p><strong>Cuit: </strong>${expense.cuit}</p>
                        <p><strong>Direccion: </strong>${expense.address}</p>
                        <p><strong>Cuotas: </strong>${(expense.dues === "") ? ("N/A") : (expense.dues)}</p>
                        <p><strong>Importe: ${(expense.currency === "ARS") ? ("$") : ("USD")} </strong>${expense.amount}</p>
                    `

                    if (expense.currency === "USD") {

                        var amountConverted = expense.amount * localdata.dolar;
                        var taxCountry = (expense.amount * localdata.dolar) * .3;
                        var taxProfits = expense.amount * localdata.dolar;
                        var taxPersonalAssets = (expense.amount * localdata.dolar) * .25;

                        toastDetails.innerHTML += `
                            <p><strong>DB Impuesto Pais (30%): $ </strong>${taxCountry.toFixed(2)}</p>
                            <p><strong>DB RG 4815 (100%): $ </strong>${taxProfits.toFixed(2)}</p>
                            <p><strong>PER 5272/5430 (25%): $ </strong>${taxPersonalAssets.toFixed(2)}</p>
                            <p><strong>Importe (Con impuestos): $ </strong>${(amountConverted + taxCountry + taxProfits + taxPersonalAssets).toFixed(2)}</p>
                        `
                    }

                    const toastCloser = document.getElementById("ToastExpenseClose");
                    toastCloser.addEventListener('click', function (e) {
                        toast.className = "";
                    });
                };
            });
        };
    });

}

function update_ExpensesShown() {

    let CardHoldersGroup = [];
    let ExpensesHTMLSection = "";
    let CheckboxGroupChecked = [...document.querySelectorAll("input[class = btn-check]:checked")].map(cardholder => cardholder.value);
    let SearchInputValue = document.getElementById("SearchInput").value.toLowerCase();

    var header = `
        <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col" colspan="2">Movimiento</th>
              <th scope="col">Cuotas</th>
              <th scope="col" id="ResumeDownloader"><button>Descargar</button></th>
              <th scope="col">Importe en pesos</th>
              <th scope="col">Importe en dolares</th>
            </tr>
        </thead>
    `
    ExpensesHTMLSection += header;
    let totalAmountPesos = 0;
    let totalAmountDollars = 0;

    localdata.cardholders.forEach(cardholder => {

        cardholder.expenses.forEach(expense => {


            if (expense.currency === "ARS") {
                totalAmountPesos += expense.amount;
            } else {
                totalAmountDollars += expense.amount;
            }

            if (((CheckboxGroupChecked.length == 0 || CheckboxGroupChecked.includes(cardholder.name))) && (SearchInputValue.length == 0 || (expense.business.toLowerCase()).includes(SearchInputValue))) {

                ExpensesHTMLSection += `
                    <tr class="row-details" data-cardholder-id="${cardholder._id}" data-expense-id="${expense._id}">
                        <th data-label="Fecha">${expense.date}</th>
                        <td data-label="Movimiento" colspan="2">${expense.business}</td>
                        <td data-label="Cuotas">${expense.dues}</td>
                        <td data-label="Moneda">${(expense.currency === "ARS") ? ("") : (expense.currency)}</td>
                        <td data-label="Importe en pesos">${(expense.currency === "USD") ? ("") : ("$ " + expense.amount)}</td>
                        <td data-label="Importe en dolares">${(expense.currency === "ARS") ? ("") : ("USD " + expense.amount)}</td>
                    </tr>
                `;

                if (!(CardHoldersGroup.includes(cardholder.name))) {
                    CardHoldersGroup.push(cardholder.name)
                }

            };
        });

        if ((CardHoldersGroup.length != 0) && (CardHoldersGroup.includes(cardholder.name))) {

            ExpensesHTMLSection += `
                <tr class="cardholder-info" data-cardholder-id="${cardholder._id}">
                    <th data-label="Condicion">${(cardholder._id === 1) ? ("Titular") : ("Adicional")}</th>
                    <th data-label="Nombre" colspan="2">${cardholder.name}</th>
                    <th data-label="Tarjeta">${cardholder.card_number}</th>
                    <th data-label="Saldo en pesos" colspan="2">Saldo en pesos: ${"$ " +totalAmountPesos}</th>
                    <th data-label="Saldo en dolares">Saldo en dolares: ${"USD " + totalAmountDollars}</th>
                </tr>
            `;
        }

        totalAmountPesos = 0;
        totalAmountDollars = 0;

    });

    if (ExpensesHTMLSection === header) {

        const toast = document.getElementById("ToastFilters");
        toast.className = "show";
        setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);

    };

    document.getElementById("Expenses").innerHTML = ExpensesHTMLSection
    document.getElementById("ResumeDownloader").addEventListener('click', download_CompleteCSV)

    document.querySelectorAll('.cardholder-info').forEach(element => {
        element.addEventListener('click', function () {
            const cardholderId = this.getAttribute('data-cardholder-id');
            download_CardholderCSV(cardholderId);
        });
    });

    document.querySelectorAll('.row-details').forEach(element => {
        element.addEventListener('click', function () {
            const cardholder_Id = this.getAttribute('data-cardholder-id');
            const expense_Id = this.getAttribute('data-expense-id');
            displayPopup(cardholder_Id, expense_Id);
        });
    });
};

init_ExpensesPage()
