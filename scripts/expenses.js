import { data as localdata } from "./localdata.js";

function init_ExpensesPage() {

    try {

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

        update_ExpensesShown()

    } catch (error) {

        console.log(error);

    };

};

function download_CardholderCSV(cardholder_id) {

    const datos = [
        ["Nombre", "Tarjeta", "Fecha", "Hora", "Movimiento", "Cuit", "Direccion", "Cuotas", "Moneda", "Importe"],
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
                registro.push(expense.business)
                registro.push(expense.cuit)
                registro.push(expense.address)
                registro.push(expense.dues)
                registro.push(expense.currency)
                registro.push(expense.amount)
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
        ["Nombre", "Tarjeta", "Fecha", "Hora", "Movimiento", "Cuit", "Direccion", "Cuotas", "Moneda", "Importe"],
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
                registro.push(expense.business)
                registro.push(expense.cuit)
                registro.push(expense.address)
                registro.push(expense.dues)
                registro.push(expense.currency)
                registro.push(expense.amount)
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
                    <p><strong>Establecimiento: </strong>${expense.business}</p>
                    <p><strong>Cuit: </strong>${expense.cuit}</p>
                    <p><strong>Direccion: </strong>${expense.address}</p>
                    <p><strong>Cuotas: </strong>${(expense.dues === "") ? ("N/A") : (expense.dues)}</p>
                    <p><strong>Moneda: </strong>${expense.currency}</p>
                    <p><strong>Importe: $ </strong>${expense.amount}</p>
                    `
                    
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
              <th scope="col">Importe</th>
            </tr>
        </thead>
    `
    ExpensesHTMLSection += header;
    let totalAmount = 0;

    localdata.cardholders.forEach(cardholder => {

        cardholder.expenses.forEach(expense => {

            totalAmount += expense.amount;
            if (((CheckboxGroupChecked.length == 0 || CheckboxGroupChecked.includes(cardholder.name))) && (SearchInputValue.length == 0 || (expense.business.toLowerCase()).includes(SearchInputValue))) {

                ExpensesHTMLSection += `
                    <tr class="row-details" data-cardholder-id="${cardholder._id}" data-expense-id="${expense._id}">
                        <th data-label="Fecha">${expense.date}</th>
                        <td data-label="Movimiento" colspan="2">${expense.business}</td>
                        <td data-label="Cuotas">${expense.dues}</td>
                        <td data-label="Moneda">${(expense.currency === "ARS") ? ("") : (expense.currency)}</td>
                        <td data-label="Importe">$ ${expense.amount}</td>
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
                    <th data-label="Importe" colspan="2">Total consumos: $ ${totalAmount}</th>
                </tr>
            `;
        }
        totalAmount = 0;

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
