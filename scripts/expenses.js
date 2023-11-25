import { data as localdata } from "./localdata.js";

async function init_ExpensesPage() {

    try {

        const theme = localStorage.getItem('theme')

        if (theme == "light") {
            document.body.className = "light-theme"
        }

        let ExpensesGroup = []
        let CardholdersGroup = []
        let CardholdersHTMLSection = ""

        localdata.expenses.forEach(expense => {

            if (!CardholdersGroup.includes(expense.cardholder)) {

                CardholdersGroup.push(expense.cardholder)

                CardholdersHTMLSection += `
                        <span class="cardholders-cardholder">
                            <input type="checkbox" class="btn-check" id="btncheck-${expense._id}" value="${expense.cardholder}">
                            <label class="btn cardholders-cardholder" for="btncheck-${expense._id}">${expense.cardholder}</label>
                        </span>
                    `;

            };

            ExpensesGroup.push(expense)



        });

        document.getElementById("CardholdersButtons").innerHTML = CardholdersHTMLSection

        const CheckboxGroup = [...document.querySelectorAll("input[class = btn-check")]
        const SearchInput = document.getElementById("SearchInput")
        const SwitchTheme = document.getElementById("Theme")

        CheckboxGroup.forEach(checkbox => {

            checkbox.addEventListener("click", update_ExpensesShown)

        });

        SearchInput.addEventListener("keyup", update_ExpensesShown)
        SwitchTheme.addEventListener("click", switch_Theme)

        return ExpensesGroup

    } catch (error) {

        console.log(error);

    };

};

function update_ExpensesShown() {

    let ExpensesHTMLSection = "";
    let CheckboxGroupChecked = [...document.querySelectorAll("input[class = btn-check]:checked")].map(cardholder => cardholder.value);
    let SearchInputValue = document.getElementById("SearchInput").value.toLowerCase();
    let header = `
    <li class="expenses-cards-item">
        <div class="card">
            <div class="card-text">
                <p>Fecha</p>
                <p>Titular</p>
                <p>Comprobante</p>
                <p>Referencia</p>
                <p>Moneda</p>
                <p>Cuotas</p>
                <p>Importe</p>
                <a href="" class="card-see-more">Descargar</a>
            </div>
        </div>
    </li>
    `
    ExpensesHTMLSection += header;

    ExpensesAvailable.forEach(expense => {

        if ((CheckboxGroupChecked.length == 0 || CheckboxGroupChecked.includes(expense.cardholder)) && (SearchInputValue.length == 0 || (expense.business.toLowerCase()).includes(SearchInputValue))) {

            ExpensesHTMLSection += `
                <li class="expenses-cards-item">
                    <div class="card">
                        <div class="card-text">
                            <p>${expense.date}</p>
                            <p>${expense.card_number}</p>
                            <p>${expense.receipt}</p>
                            <p>${expense.business}</p>
                            <p>${(expense.currency === "ARS") ? ("") : (expense.currency)}</p>
                            <p>${expense.dues}</p>
                            <p>$ ${expense.amount}</p>
                            <a href="" class="card-see-more">Detalles</a>
                        </div>
                    </div>
                </li>
            `;

        };

    });

    if (ExpensesHTMLSection == header) {

        const toast = document.getElementById("Toast");
        toast.className = "show";
        setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);

    };

    document.getElementById("Expenses").innerHTML = ExpensesHTMLSection

};

function switch_Theme() {

    const theme = localStorage.getItem('theme');
    document.body.className === "" ? document.body.className = "light-theme" : document.body.className = ""
    theme == null ? localStorage.setItem("theme", "light") : localStorage.removeItem('theme');

};

const ExpensesAvailable = await init_ExpensesPage()

update_ExpensesShown()