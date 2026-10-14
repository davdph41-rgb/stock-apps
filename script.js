

const DEFAULT_STOCK = [
    {
        name: "French Fries",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Chicken Wings",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Prawn Mayo",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Mekencis",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Beef Burger",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Fish & Chips",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    },
    {
        name: "Mix Platters",
        stockAwal: 0,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    }
];


/* ========================================
   2. MEMUAT DATA
======================================== */

function loadStock() {
    try {
        const saved = localStorage.getItem("stockData");

        if (saved === null) {
            return structuredClone(DEFAULT_STOCK);
        }

        const data = JSON.parse(saved);

        if (!Array.isArray(data)) {
            throw new Error("Format data tidak valid");
        }

        return data;
    } catch (error) {
        alert("Data stok tidak bisa dibaca. Data awal akan digunakan.");
        return structuredClone(DEFAULT_STOCK);
    }
}


let stockData = loadStock();


/* ========================================
   3. RIWAYAT TRANSAKSI
======================================== */

function loadTransactions() {
    try {
        const saved = localStorage.getItem("stockTransactions");
        const data = saved ? JSON.parse(saved) : [];

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}


let transactions = loadTransactions();


/* ========================================
   4. MENGHITUNG STOK SAAT INI
======================================== */

function calculateStock(item) {
    return (
        item.stockAwal
        - item.reservasi
        - item.sesi1
        - item.sesi2
        - item.manual
    );
}


/* ========================================
   5. MENYIMPAN DATA
======================================== */

function saveData() {
    localStorage.setItem(
        "stockData",
        JSON.stringify(stockData)
    );

    localStorage.setItem(
        "stockTransactions",
        JSON.stringify(transactions)
    );
}


/* ========================================
   6. MENAMPILKAN DAFTAR MENU
======================================== */

/* ========================================
   MENAMPILKAN DAFTAR MENU
======================================== */

function renderStock() {

    const stockList = document.getElementById("stockList");

    stockList.innerHTML = "";

    stockData.forEach((item, index) => {

        const stockSaatIni = calculateStock(item);

        const card = document.createElement("div");

        card.className = "stock-item stock-detail-card";


        // Nama menu
        const title = document.createElement("h3");

        title.className = "menu-name";

        title.textContent = item.name;


        // Stok saat ini
        const currentStock = document.createElement("div");

        currentStock.className = "current-stock";

        currentStock.textContent = stockSaatIni + " PCS";


        const currentLabel = document.createElement("p");

        currentLabel.className = "current-stock-label";

        currentLabel.textContent = "STOK SAAT INI";


        // Rincian stok
        const details = document.createElement("div");

        details.className = "stock-details";


        const detailRows = [

            ["Stok Awal", item.stockAwal],

            ["Reservasi", -item.reservasi],

            ["Sesi 1", -item.sesi1],

            ["Sesi 2", -item.sesi2],

            ["Manual", -item.manual]

        ];


        detailRows.forEach(([label, value]) => {

            const row = document.createElement("div");

            row.className = "stock-detail-row";


            const rowLabel = document.createElement("span");

            rowLabel.textContent = label;


            const rowValue = document.createElement("span");

            rowValue.textContent = value;


            row.appendChild(rowLabel);

            row.appendChild(rowValue);

            details.appendChild(row);

        });

      // Tombol edit stok awal
const editButton = document.createElement("button");

editButton.className = "card-edit-btn";

editButton.textContent = "Edit Stok Awal";

editButton.addEventListener("click", () => {

    const input = prompt(
        "Masukkan stok awal baru untuk " + item.name,
        item.stockAwal
    );

    // Jika pengguna menekan Cancel
    if (input === null) {
        return;
    }

    // Pastikan jumlah berupa bilangan bulat
    const newStock = Number(input);

    if (
        input.trim() === "" ||
        !Number.isSafeInteger(newStock) ||
        newStock < 0
    ) {
        alert("Stok harus berupa bilangan bulat nol atau lebih.");
        return;
    }

    // Periksa apakah stok baru mencukupi
    const totalPengurangan =
        item.reservasi +
        item.sesi1 +
        item.sesi2 +
        item.manual;

    if (newStock < totalPengurangan) {
        alert(
            "Stok awal tidak boleh lebih kecil daripada total pengurangan.\n\n" +
            "Total pengurangan: " + totalPengurangan + " pcs."
        );
        return;
    }

    // Simpan stok awal baru
    item.stockAwal = newStock;

    saveData();

    renderStock();

    alert("Stok awal berhasil diperbarui!");

});


        // Tombol transaksi
        const transactionButton = document.createElement("button");

        transactionButton.className = "card-transaction-btn";

        transactionButton.textContent = "+ Transaksi";


        transactionButton.addEventListener("click", () => {

            document.getElementById("transactionMenu").value = index;

            document.getElementById("transactionAmount").focus();

            document.getElementById("transactionForm").scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });


        // Susun kartu
        card.appendChild(title);

        card.appendChild(currentLabel);

        card.appendChild(currentStock);

        card.appendChild(details);

        card.appendChild(editButton);

card.appendChild(transactionButton);

stockList.appendChild(card);

    });


    updateTotal();

}


/* ========================================
   7. TOTAL STOK
======================================== */

function updateTotal() {
    const total = stockData.reduce(
        (sum, item) => sum + calculateStock(item),
        0
    );

    document.getElementById("totalStock").textContent = total;

    document.getElementById("menuCount").textContent =
        stockData.length + " Menu";
}


/* ========================================
   8. DETAIL STOK
======================================== */

function showDetail(index) {
    const item = stockData[index];

    const sisa = calculateStock(item);

    alert(
        `MENU: ${item.name}\n\n` +
        `Stok Awal: ${item.stockAwal}\n` +
        `Reservasi: ${item.reservasi}\n` +
        `Sesi 1: ${item.sesi1}\n` +
        `Sesi 2: ${item.sesi2}\n` +
        `Manual: ${item.manual}\n\n` +
        `STOK SAAT INI: ${sisa} pcs`
    );
}


/* ========================================
   9. TAMBAH MENU BARU
======================================== */

function addMenu() {
    const nameInput = document.getElementById("menuName");
    const stockInput = document.getElementById("menuStock");

    const name = nameInput.value.trim();
    const stock = Number(stockInput.value);

    if (name === "") {
        alert("Masukkan nama menu terlebih dahulu.");
        return;
    }

    if (stockInput.value.trim() === "" ||
        !Number.isSafeInteger(stock) ||
        stock < 0) {
        alert("Stok harus berupa bilangan bulat nol atau lebih.");
        return;
    }

    const alreadyExists = stockData.some(
        item => item.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
        alert("Nama menu tersebut sudah ada.");
        return;
    }

    stockData.push({
        name: name,
        stockAwal: stock,
        reservasi: 0,
        sesi1: 0,
        sesi2: 0,
        manual: 0
    });

    saveData();
    renderStock();

    nameInput.value = "";
    stockInput.value = "";

    alert("Menu berhasil ditambahkan!");
}


/* ========================================
   10. RESET DATA
======================================== */

function resetStock() {
    const confirmReset = confirm(
        "PERINGATAN!\n\n" +
        "Semua data stok dan riwayat transaksi akan dihapus " +
        "dan dikembalikan ke data awal.\n\n" +
        "Lanjutkan?"
    );

    if (!confirmReset) {
        return;
    }

    stockData = structuredClone(DEFAULT_STOCK);
    transactions = [];

    saveData();
    renderStock();

    alert("Data stok berhasil dikembalikan ke data awal.");
}


/* ========================================
   11. JALANKAN APLIKASI
======================================== */

renderStock();

/* ========================================
   12. MENGISI PILIHAN MENU
======================================== */

function renderTransactionMenu() {

    const select = document.getElementById("transactionMenu");

    select.innerHTML = "";

    stockData.forEach((item, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = item.name;

        select.appendChild(option);

    });

}


/* ========================================
   13. MENYIMPAN TRANSAKSI
======================================== */

document.getElementById("transactionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const menuIndex = Number(
            document.getElementById("transactionMenu").value
        );

        const type = document.getElementById("transactionType").value;

        const amountInput = document.getElementById("transactionAmount");

        const amount = Number(amountInput.value);

        const note = document.getElementById("transactionNote")
            .value.trim();

        const item = stockData[menuIndex];

        if (!item) {
            alert("Silakan pilih menu.");
            return;
        }

        if (
            amountInput.value.trim() === "" ||
            !Number.isSafeInteger(amount) ||
            amount <= 0
        ) {
            alert("Jumlah harus berupa bilangan bulat lebih dari nol.");
            return;
        }

        const stockBefore = calculateStock(item);

        if (amount > stockBefore) {
            alert(
                "Stok tidak mencukupi!\n" +
                "Stok tersedia: " + stockBefore + " pcs."
            );
            return;
        }

        // Tambahkan pengurangan ke kategori yang dipilih.
        item[type] += amount;

        // Simpan riwayat transaksi.
        transactions.unshift({

            menu: item.name,

            jenis: type,

            jumlah: amount,

            catatan: note,

            waktu: new Date().toISOString()

        });

        saveData();

        renderStock();

        renderTransactionHistory();

        this.reset();

        renderTransactionMenu();

        alert("Transaksi berhasil disimpan!");

    });


/* ========================================
   14. MENAMPILKAN RIWAYAT
======================================== */

/* ========================================
   RIWAYAT TRANSAKSI
======================================== */

function renderTransactionHistory() {

    const history =
        document.getElementById("transactionHistory");

    history.innerHTML = "";

    if (transactions.length === 0) {

        history.textContent = "Belum ada transaksi.";

        return;

    }

    transactions.forEach((transaction, index) => {

        const card = document.createElement("div");

        card.className = "history-item";


        // Nama menu
        const title = document.createElement("h3");

        title.textContent = transaction.menu;


        // Jenis transaksi
        const type = document.createElement("p");

        type.textContent =
            "Jenis: " +
            getTransactionTypeName(transaction.jenis);


        // Jumlah pengurangan
        const amount = document.createElement("p");

        amount.className = "history-amount";

        amount.textContent =
            "Pengurangan: -" +
            transaction.jumlah +
            " pcs";


        // Catatan
        const note = document.createElement("p");

        note.textContent =
            "Catatan: " +
            (transaction.catatan || "-");


        // Waktu
        const time = document.createElement("p");

        time.className = "history-time";

        time.textContent = transaction.waktu;


        // Tombol pembatalan
        const cancelButton =
            document.createElement("button");

        cancelButton.className = "cancel-transaction-btn";

        cancelButton.textContent = "Batalkan Transaksi";


        cancelButton.addEventListener("click", () => {

            cancelTransaction(index);

        });


        // Susun kartu riwayat
        card.appendChild(title);

        card.appendChild(type);

        card.appendChild(amount);

        card.appendChild(note);

        card.appendChild(time);

        card.appendChild(cancelButton);


        history.appendChild(card);

    });

}


/* ========================================
   MEMBATALKAN TRANSAKSI
======================================== */

function cancelTransaction(index) {

    const transaction = transactions[index];

    if (!transaction) {
        alert("Transaksi tidak ditemukan.");
        return;
    }

    const confirmCancel = confirm(
        "Batalkan transaksi ini?\n\n" +
        "Menu: " + transaction.menu + "\n" +
        "Jenis: " +
        getTransactionTypeName(transaction.jenis) + "\n" +
        "Jumlah: " + transaction.jumlah + " pcs"
    );

    if (!confirmCancel) {
        return;
    }


    // Cari menu yang sesuai
    const item = stockData.find(
        menu => menu.name === transaction.menu
    );

    if (!item) {
        alert(
            "Menu tidak ditemukan. " +
            "Transaksi tidak dibatalkan."
        );

        return;
    }


    // Pastikan kategori transaksi valid
    const validTypes = [
        "reservasi",
        "sesi1",
        "sesi2",
        "manual"
    ];

    if (!validTypes.includes(transaction.jenis)) {
        alert("Jenis transaksi tidak valid.");
        return;
    }


    // Pastikan jumlah pengurangan dapat dikembalikan
    if (
        !Number.isSafeInteger(transaction.jumlah) ||
        transaction.jumlah <= 0 ||
        item[transaction.jenis] < transaction.jumlah
    ) {
        alert(
            "Transaksi tidak dapat dibatalkan dengan aman."
        );

        return;
    }


    // Kembalikan jumlah ke kategori semula
    item[transaction.jenis] -= transaction.jumlah;


    // Hapus transaksi dari riwayat
    transactions.splice(index, 1);


    // Simpan dan perbarui tampilan
    saveData();

    renderStock();

    renderTransactionHistory();


    alert(
        "Transaksi berhasil dibatalkan.\n" +
        "Stok sudah diperbarui."
    );

}


/* ========================================
   15. NAMA JENIS TRANSAKSI
======================================== */

function getTransactionTypeName(type) {

    const names = {

        reservasi: "Reservasi",

        sesi1: "Sesi 1",

        sesi2: "Sesi 2",

        manual: "Penjualan Manual"

    };

    return names[type] || type;

}


/* ========================================
   16. INISIALISASI FORM
======================================== */

renderTransactionMenu();

renderTransactionHistory();



/* ========================================
   17. TANGGAL LOKAL
======================================== */

function getLocalDateString(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ========================================
   18. MEMERIKSA TANGGAL TRANSAKSI
======================================== */

function getTransactionDate(transaction) {

    if (!transaction.waktu) {
        return null;
    }

    // Format ISO untuk transaksi baru
    const date = new Date(transaction.waktu);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return getLocalDateString(date);

}


/* ========================================
   19. MENGHITUNG LAPORAN
======================================== */

function calculateDailyReport(dateString) {

    const report = {

        menuCount: stockData.length,

        openingStock: 0,

        reservasi: 0,

        sesi1: 0,

        sesi2: 0,

        manual: 0,

        closingStock: 0

    };


    // Stok awal yang digunakan adalah stokAwal
    // pada data menu saat laporan dibuat.
    stockData.forEach(item => {

        report.openingStock += item.stockAwal;

    });


    // Hanya transaksi pada tanggal pilihan
    transactions.forEach(transaction => {

        if (
            getTransactionDate(transaction) !== dateString
        ) {
            return;
        }

        // Transaksi yang tidak memiliki kategori valid dilewati.
        if (
            !["reservasi", "sesi1", "sesi2", "manual"]
                .includes(transaction.jenis)
        ) {
            return;
        }

        const amount = Number(transaction.jumlah);

        if (
            !Number.isSafeInteger(amount) ||
            amount <= 0
        ) {
            return;
        }

        report[transaction.jenis] += amount;

    });


    const totalDeduction =
        report.reservasi +
        report.sesi1 +
        report.sesi2 +
        report.manual;


    report.closingStock =
        report.openingStock - totalDeduction;


    return report;

}


/* ========================================
   20. MENAMPILKAN LAPORAN
======================================== */

function renderDailyReport() {

    const dateInput =
        document.getElementById("reportDate");

    if (!dateInput.value) {
        return;
    }

    const report =
        calculateDailyReport(dateInput.value);


    document.getElementById(
        "reportMenuCount"
    ).textContent = report.menuCount;


    document.getElementById(
        "reportOpeningStock"
    ).textContent = report.openingStock + " pcs";


    document.getElementById(
        "reportReservation"
    ).textContent = report.reservasi + " pcs";


    document.getElementById(
        "reportSession1"
    ).textContent = report.sesi1 + " pcs";


    document.getElementById(
        "reportSession2"
    ).textContent = report.sesi2 + " pcs";


    document.getElementById(
        "reportManual"
    ).textContent = report.manual + " pcs";


    document.getElementById(
        "reportClosingStock"
    ).textContent = report.closingStock + " pcs";

}


/* ========================================
   21. EXPORT LAPORAN CSV
======================================== */

function exportDailyReport() {

    const dateString =
        document.getElementById("reportDate").value;

    if (!dateString) {
        alert("Pilih tanggal laporan terlebih dahulu.");
        return;
    }

    const report =
        calculateDailyReport(dateString);


    // Membuat isi CSV
    const rows = [

        ["LAPORAN STOK HARIAN"],

        ["Tanggal", dateString],

        [],

        ["Ringkasan", "Jumlah"],

        ["Jumlah Menu", report.menuCount],

        ["Total Stok Awal", report.openingStock],

        ["Reservasi", report.reservasi],

        ["Sesi 1", report.sesi1],

        ["Sesi 2", report.sesi2],

        ["Penjualan Manual", report.manual],

        ["Stok Saat Ini", report.closingStock],

        [],

        [
            "Nama Menu",
            "Stok Awal",
            "Reservasi",
            "Sesi 1",
            "Sesi 2",
            "Manual",
            "Stok Saat Ini"
        ]

    ];


    stockData.forEach(item => {

        const currentStock =
            calculateStock(item);

        rows.push([

            item.name,

            item.stockAwal,

            item.reservasi,

            item.sesi1,

            item.sesi2,

            item.manual,

            currentStock

        ]);

    });


    // Mengubah data menjadi format CSV
    const csv = rows.map(row => {

        return row.map(value => {

            const text = String(value ?? "");

            return '"' +
                text.replace(/"/g, '""') +
                '"';

        }).join(",");

    }).join("\r\n");


    // BOM membantu Excel mengenali teks UTF-8
    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        "Laporan-Stok-" + dateString + ".csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


/* ========================================
   22. INISIALISASI LAPORAN
======================================== */

const reportDateInput =
    document.getElementById("reportDate");


reportDateInput.value =
    getLocalDateString();


reportDateInput.addEventListener(
    "change",
    renderDailyReport
);


document.getElementById("exportReportBtn")
    .addEventListener(
        "click",
        exportDailyReport
    );


renderDailyReport();

/* ========================================
   23. REGISTRASI SERVICE WORKER (PWA)
======================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(registration => {
                console.log(
                    "Service Worker aktif:",
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    "Service Worker gagal:",
                    error
                );
            });

    });

}
