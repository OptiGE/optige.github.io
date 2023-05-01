document.getElementById("generateBtn").addEventListener("click", generateList);

let allData = [];

document.getElementById("jsonFileInput").addEventListener("change", (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const jsonData = JSON.parse(event.target.result);
            allData.push(...jsonData);
        };
        reader.readAsText(file);
    });
});

function generateList() {
    const combinedData = allData.reduce((acc, item) => {
        const found = acc.find((x) => x.id === item.id);
        if (found) {
            Object.keys(found).forEach((key) => {
                if (typeof found[key] === "number" && key !== 'total') {
                    found[key] += item[key];
                }
            });

            const otherFound = found.otherItems.find((x) => x.description === item.other.description);
            if (otherFound) {
                otherFound.quantity += item.other.quantity;
                otherFound.totalPrice += item.other.totalPrice;
            } else {
                found.otherItems.push(item.other);
            }

            found.total += item.total;
        } else {
            const newItem = { ...item, otherItems: [item.other] };
            delete newItem.other;
            acc.push(newItem);
        }
        return acc;
    }, []);

    combinedData.sort((a, b) => a.id - b.id);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    combinedData.forEach((item) => {
        const row = document.createElement("div");
        row.className = "row";

        const info = document.createElement("div");
        info.className = "info";
        info.innerHTML = `<span>${item.id} - ${item.name}</span>`;
        row.appendChild(info);

        const total = document.createElement("span");
        total.textContent = `${item.total}kr`;
        row.appendChild(total);

        const message = 
        
`Tack, ${item.name}, för att du var med på Bondhelgen 2023!

Dina köp: 
Beer - ${item.beer}, 
Cider - ${item.cider}, 
Sausage - ${item.sausage}, 
Shot - ${item.shot}, 
Chips - ${item.chips}, 
Drink - ${item.drink}, 
Other - ${item.otherItems.map(other => other.quantity == "0" ? "" : `${other.quantity} (${other.description})`).join(' ')}.

Total: ${item.total}kr.

Vänligen swisha till 07XXXXXXXX, puss och kram!`;

        row.addEventListener("click", () => {
            navigator.clipboard.writeText(message);
        });

        const contactButtons = document.createElement("span");
        contactButtons.className = "contact-buttons";

        if (item.phone) {
            const phoneLink = document.createElement("a");
            phoneLink.href = `sms:${item.phone}?body=${encodeURIComponent(message)}`;
            phoneLink.textContent = "SMS";
            contactButtons.appendChild(phoneLink);
        }
        if (item.email) {
            const emailLink = document.createElement("a");
            emailLink.href = `mailto:${item.email}?subject=Purchase%20Summary&body=${encodeURIComponent(message)}`;
            emailLink.textContent = "Email";
            contactButtons.appendChild(emailLink);
        }

        row.appendChild(contactButtons);
        resultsDiv.appendChild(row);
    });
}