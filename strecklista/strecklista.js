document.getElementById("purchaseForm").addEventListener("submit", function (event) {
    event.preventDefault();
    addPurchase();
});

document.getElementById("beerPrice").addEventListener("change", updatePrices);
document.getElementById("ciderPrice").addEventListener("change", updatePrices);
document.getElementById("sausagePrice").addEventListener("change", updatePrices);
document.getElementById("shotPrice").addEventListener("change", updatePrices);
document.getElementById("drinkPrice").addEventListener("change", updatePrices);
document.getElementById("clearCache").addEventListener("click", clearCache);
document.getElementById("saveJSON").addEventListener("click", saveAsJSON);

let purchaseLog = [];

function addPurchase() {
    const personId = document.getElementById("name").value.trim();
    const person = people.find(p => p.id === personId);
    if(!person){
        alert("Invalid ID entered")
    }

    const name = person.name;
    const beer = parseInt(document.getElementById("beer").value) || 0;
    const cider = parseInt(document.getElementById("cider").value) || 0;
    const sausage = parseInt(document.getElementById("sausage").value) || 0;
    const shot = parseInt(document.getElementById("shot").value) || 0;
    const drink = parseInt(document.getElementById("drink").value) || 0;
    const other = parseInt(document.getElementById("other").value) || 0;
    const otherDesc = document.getElementById("otherDesc").value;
    const otherPrice = parseFloat(document.getElementById("otherPrice").value) || 0;

    if (beer + cider + sausage + shot + drink + other === 0) {
        alert("Please add at least one item.");
        return;
    }

    const beerPrice = parseFloat(document.getElementById("beerPrice").value);
    const ciderPrice = parseFloat(document.getElementById("ciderPrice").value);
    const sausagePrice = parseFloat(document.getElementById("sausagePrice").value);
    const shotPrice = parseFloat(document.getElementById("shotPrice").value);
    const drinkPrice = parseFloat(document.getElementById("drinkPrice").value);

    const date = new Date();
    const dateTime = `${date.getDate()}/${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`;
    const total = beer * beerPrice + cider * ciderPrice + sausage * sausagePrice + shot * shotPrice + drink * drinkPrice + other * otherPrice;

    const table = document.getElementById("purchases");
    const row = table.insertRow(-1);

    row.setAttribute("data-index", purchaseLog.length);

    const nameCell = row.insertCell(0);
    const dateTimeCell = row.insertCell(1);
    const beerCell = row.insertCell(2);
    const ciderCell = row.insertCell(3);
    const sausageCell = row.insertCell(4);
    const shotCell = row.insertCell(5);
    const drinkCell = row.insertCell(6);
    const otherCell = row.insertCell(7);
    const totalCell = row.insertCell(8);
    const deleteCell = row.insertCell(9);

    nameCell.textContent = `(${personId}) ${name}`;
    dateTimeCell.textContent = dateTime;
    beerCell.textContent = beer;
    ciderCell.textContent = cider;
    sausageCell.textContent = sausage;
    shotCell.textContent = shot;
    drinkCell.textContent = drink;
    otherCell.textContent = other ? `${other} (${otherDesc}, ${otherPrice} kr)`: other;
    totalCell.textContent = `${total}kr`;

    deleteCell.innerHTML = '<button class="deleteBtn">Delete</button>';

    const purchase = {
        id: personId,
        name,
        dateTime,
        beer,
        cider,
        sausage,
        shot,
        drink,
        other: {
            quantity: other,
            description: otherDesc,
            price: otherPrice,
            totalPrice: other * otherPrice,
        },
        total,
    };

    purchaseLog.push(purchase); // Bör vara unshift?

    // Clear the form inputs
    document.getElementById("name").value = "";
    document.getElementById("beer").value = "";
    document.getElementById("cider").value = "";
    document.getElementById("sausage").value = "";
    document.getElementById("shot").value = "";
    document.getElementById("drink").value = "";
    document.getElementById("other").value = "";
    document.getElementById("otherDesc").value = "";
    document.getElementById("otherPrice").value = "";

    deleteCell.querySelector(".deleteBtn").addEventListener("click", function () {
        deletePurchase(row);
    });

    savePurchaseLogToLocalStorage();
}

function editPurchase(row) {
    const index = parseInt(row.getAttribute("data-index"));
    const purchase = purchaseLog[index];
    document.getElementById("name").value = purchase.name;
    document.getElementById("beer").value = purchase.beer;
    document.getElementById("cider").value = purchase.cider;
    document.getElementById("sausage").value = purchase.sausage;
    document.getElementById("shot").value = purchase.shot;
    document.getElementById("drink").value = purchase.drink;
    document.getElementById("other").value = purchase.other.quantity;
    document.getElementById("otherDesc").value = purchase.other.description;
    document.getElementById("otherPrice").value = purchase.other.price;

    row.remove();
    purchaseLog.splice(index, 1);
    updateRowIndexes();
}

function deletePurchase(row) {
    const toDelete = confirm("Are you sure you want to delete this row?")
    if(toDelete != true) return;
    const index = parseInt(row.getAttribute("data-index"));
    row.remove();
    purchaseLog.splice(index, 1);
    updateRowIndexes();
    savePurchaseLogToLocalStorage();
}

function updateRowIndexes() {
    const table = document.getElementById("purchases");
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].setAttribute("data-index", i - 1);
    }
}

function saveAsJSON() {
    const json = JSON.stringify(purchaseLog);
    const fileName = "purchase_log.json";
    const file = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function savePurchaseLog() {
    const headers = [
        "Name",
        "Date/Time",
        "Beer",
        "Cider",
        "Sausage",
        "Shot",
        "Drink",
        "Other",
        "Total",
    ];

    let csvContent = headers.join(",") + "\n";

    for (const purchase of purchaseLog) {
        const row = [
            purchase.name,
            purchase.dateTime,
            purchase.beer,
            purchase.cider,
            purchase.sausage,
            purchase.shot,
            purchase.drink,
            purchase.other.description,
            purchase.total,
        ];

        csvContent += row.join(",") + "\n";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "purchase_log.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function updatePrices() {
    const beerPrice = parseFloat(document.getElementById("beerPrice").value) || 0;
    const ciderPrice = parseFloat(document.getElementById("ciderPrice").value) || 0;
    const sausagePrice = parseFloat(document.getElementById("sausagePrice").value) || 0;
    const shotPrice = parseFloat(document.getElementById("shotPrice").value) || 0;
    const drinkPrice = parseFloat(document.getElementById("drinkPrice").value) || 0;

    for (const purchase of purchaseLog) {
        purchase.total = (purchase.beer * beerPrice) +
            (purchase.cider * ciderPrice) +
            (purchase.sausage * sausagePrice) +
            (purchase.shot * shotPrice) +
            (purchase.drink * drinkPrice) +
            purchase.other.totalPrice;

        const rowIndex = purchaseLog.indexOf(purchase);
        const tableRow = document.getElementById("purchases").rows[rowIndex + 1];
        tableRow.cells[8].textContent = `${purchase.total} kr`;
    }

    savePurchaseLogToLocalStorage();
}

function parseCSV(csv) {
    const rows = csv.split("\n");
    const data = [];

    for (const row of rows) {
        const values = row.split(";");
        if (values.length >= 4) {
            data.push({
                id: values[0].trim(),
                name: values[1].trim(),
                tag: values[2].trim(),
                team: values[3].trim(),
            });
        }
    }

    return data;
}

let people = [];

function handleCSVUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        people = parseCSV(contents);
    };

    reader.readAsText(file);
}

document.getElementById("csvFile").addEventListener("change", handleCSVUpload);

function savePurchaseLogToLocalStorage() {
    localStorage.setItem("purchaseLog", JSON.stringify(purchaseLog));
}

function addToTable(purchase) {
    const table = document.getElementById("purchases");
    const row = table.insertRow();

    row.insertCell().textContent = `(${purchase.id}) ${purchase.name}`;
    row.insertCell().textContent = purchase.dateTime;
    row.insertCell().textContent = purchase.beer;
    row.insertCell().textContent = purchase.cider;
    row.insertCell().textContent = purchase.sausage;
    row.insertCell().textContent = purchase.shot;
    row.insertCell().textContent = purchase.drink;
    row.insertCell().textContent = purchase.other.quantity ? `${purchase.other.quantity} (${purchase.other.description}, ${purchase.other.price} kr)`: "0";
    row.insertCell().textContent = `${purchase.total}kr`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deletePurchase(row)); // Use a closure

    const actionsCell = row.insertCell();
    actionsCell.appendChild(document.createTextNode(" "));
    actionsCell.appendChild(deleteButton);

    row.purchase = purchase; // Store the purchase object in the row
}



function loadPurchaseLogFromLocalStorage() {
    const savedPurchaseLog = localStorage.getItem("purchaseLog");

    if (savedPurchaseLog) {
        purchaseLog = JSON.parse(savedPurchaseLog);

        for (const purchase of purchaseLog) {
            addToTable(purchase);
        }
    }
}

function clearCache() {
    let ans = confirm("Are you sure you want to delete the cache?")
    if(ans != true) return;

    ans = confirm("Are you aware that this deletes all the purchase history?")
    if(ans != true) return;

    ans = confirm("Pinky promise that you have saved the file if it's important!")
    if(ans != true) return;

    localStorage.removeItem("purchaseLog");
    alert("Cache cleared!");

    window.location.reload();
}

loadPurchaseLogFromLocalStorage();
