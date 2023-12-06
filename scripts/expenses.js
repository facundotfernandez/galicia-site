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

function displayPopup(row) {
    // Get all cells in the clicked row
    var cells = row.cells;

    // Extract text content from each cell
    var fecha = cells[0].innerText;
    var tarjeta = cells[1].innerText;
    var movimiento = cells[2].innerText;
    var cuotas = cells[3].innerText;
    var moneda = cells[4].innerText;
    var importe = cells[5].innerText;

    // Create a div for the popup
    var popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <strong>Fecha:</strong> ${fecha}<br>
      <strong>Tarjeta:</strong> ${tarjeta}<br>
      <strong>Movimiento:</strong> ${movimiento}<br>
      <strong>Cuotas:</strong> ${cuotas}<br>
      <strong>Moneda:</strong> ${moneda}<br>
      <strong>Importe:</strong> ${importe}
    `;

    // Add the popup to the document body
    document.getElementById("Expenses").innerHTML.appendChild(popup);

    // Close the popup when clicking outside of it
    document.body.addEventListener('click', function (e) {
        if (!popup.contains(e.target)) {
            document.body.removeChild(popup);
        }
    });
}

function update_ExpensesShown() {

    let CardHoldersGroup = [];
    let ExpensesHTMLSection = "";
    let CheckboxGroupChecked = [...document.querySelectorAll("input[class = btn-check]:checked")].map(cardholder => cardholder.value);
    let SearchInputValue = document.getElementById("SearchInput").value.toLowerCase();
    let header = `
        <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col" colspan="2">Movimiento</th>
              <th scope="col">Cuotas</th>
              <th scope="col"></th>
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
                    <tr class="row-clickable">
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

        if (CardHoldersGroup.includes(cardholder.name)) {
            
            ExpensesHTMLSection += `
                <tr class="cardholder-info">
                    <th data-label="Condicion">${(cardholder._id === 1) ? ("Titular") : ("Adicional")}</th>
                    <th data-label="Fecha" colspan="2">${cardholder.name}</th>
                    <th data-label="Tarjeta">${cardholder.card_number}</th>
                    <th data-label="Importe" colspan="2">Total consumos: $ ${totalAmount}</th>
                </tr>
            `;
        }
        totalAmount = 0;

    });

    if (ExpensesHTMLSection === header) {

        const toast = document.getElementById("Toast");
        toast.className = "show";
        setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);

    };

    document.getElementById("Expenses").innerHTML = ExpensesHTMLSection

    const RowClickableGroup = [...document.querySelectorAll("tr.row-clickable")]

    RowClickableGroup.forEach((row) => {
        row.addEventListener("click", function () {
            displayPopup(row);
        });
    });

};

init_ExpensesPage()
