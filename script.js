document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settingsForm');
    const registrationForm = document.getElementById('registrationForm');
    const workLogForm = document.getElementById('workLogForm');
    const invoiceForm = document.getElementById('invoiceForm');
    const invoiceResult = document.getElementById('invoiceResult');

    // Store data in memory
    const workers = {};
    let settings = {
        payRate: 15,
        bonusThreshold: 30000,
        bonusForOvertime: 10000,
        factoryDailyRate: 1500
    };

    // Save Settings
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        settings.payRate = parseFloat(document.getElementById('payRate').value);
        settings.bonusThreshold = parseInt(document.getElementById('bonusThreshold').value);
        settings.bonusForOvertime = parseFloat(document.getElementById('bonusForOvertime').value);
        settings.factoryDailyRate = parseFloat(document.getElementById('factoryDailyRate').value);

        alert('Settings Saved Successfully!');
    });

    // Register Worker
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const workerName = document.getElementById('workerName').value;
        const workerId = document.getElementById('workerId').value;

        if (!workers[workerId]) {
            workers[workerId] = {
                name: workerName,
                workLogs: [],
                totalDeduction: 0,
                totalAdvenceMoney: 0
            };

            alert('Worker Registered Successfully!');
            registrationForm.reset();
        } else {
            alert('Worker ID already exists.');
        }
    });

    // Submit Work Log
    workLogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const workerId = document.getElementById('workerIdLog').value;
        const plantsScraped = parseInt(document.getElementById('plantsScraped').value);
        const daysScraped = parseInt(document.getElementById('daysScraped').value);
        const extraDay = parseInt(document.getElementById('extraDay').value);
        const factoryDays = parseInt(document.getElementById('factoryDays').value) || 0;
        const advenceMoney = parseInt(document.getElementById('advenceMoney').value) || 0;
        const deduction = parseFloat(document.getElementById('deduction').value) || 0;

        if (workers[workerId]) {
            workers[workerId].workLogs.push({
                plantsScraped,
                daysScraped,
                extraDay,
                factoryDays,
                advenceMoney,
                deduction
            });
            workers[workerId].totalAdvenceMoney += advenceMoney;
            workers[workerId].totalDeduction += deduction;

            alert('Work Log Submitted Successfully!');
            workLogForm.reset();
        } else {
            alert('Worker ID not found.');
        }
    });

    // Generate Invoice
    invoiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const workerId = document.getElementById('workerIdInvoice').value;

        if (workers[workerId]) {
            const worker = workers[workerId];
            let totalPlantsScraped = 0;
            let totalDaysScraped = 0;
            let totalExtraDay = 0;
            let totalFactoryDays = 0;
            let totalDeduction = worker.totalDeduction;
            let totalAdvenceMoney = worker.totalAdvenceMoney;

            worker.workLogs.forEach(log => {
                totalPlantsScraped += log.plantsScraped;
                totalDaysScraped += log.daysScraped;
                totalExtraDay += log.extraDay;
                totalFactoryDays += log.factoryDays;
            });

            const { payRate, bonusThreshold, bonusForOvertime, factoryDailyRate } = settings;

            let monthlySalary = totalPlantsScraped * payRate;
            let bonus = 0;
            let overtime = 0;
            totalDaysScraped += totalExtraDay;
            if (totalDaysScraped >= 28) {
                if (totalDaysScraped>28) {
                    overtime = totalExtraDay * bonusForOvertime;
                }else overtime = 0;
                bonus = bonusThreshold + overtime;
            }else bonus = 0;

           

            let factorySalary = totalFactoryDays * factoryDailyRate;
            let totalSalary = monthlySalary + factorySalary - totalDeduction + bonus;
            let AdvenceMoney = totalAdvenceMoney - totalDeduction;

            // Display the invoice
            const invoiceHTML = `
                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
                <thead>
                    <tr style="background-color: #4CAF50; color: white;">
                        <th colspan="2" style="padding: 10px; text-align: left;">ငွေရှင်းတမ်း - ${worker.name}</th>
                    </tr>
                </thead>
                <br>
                <tbody>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">အလုပ်သမာနံပါတ်:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${workerId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">ခြစ်ပင်အရေအတွက်:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${totalPlantsScraped}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">ခြစ်ရက်:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${totalDaysScraped}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">စက်ရုံဝင်ရက်:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${totalFactoryDays}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">နှုုတ်ယူလိုသောကြိုတင်ငွေ:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${totalDeduction.toFixed(2)} ကျပ်</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">လက်ကျန်ကြိုတင်ငွေ:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${AdvenceMoney.toFixed(2)} ကျပ်</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">ဘောနပ်:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${bonus.toFixed(2)} ကျပ်</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">လစာ:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${totalSalary.toFixed(2)} ကျပ်</td>
                    </tr>
                </tbody>
                </table>
            `;
            document.getElementById('invoiceResult').innerHTML = invoiceHTML;
        } else {
            alert('Worker ID not found.');
        }
    });
});

function printInvoice() {
    // Only prints the invoice section
    const invoiceContent = document.getElementById('invoiceResult').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = invoiceContent; // Replace the entire page content with the invoice
    window.print(); // Open the print dialog
    document.body.innerHTML = originalContent; // Restore the original page content
}
