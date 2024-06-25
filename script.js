document.addEventListener('DOMContentLoaded', function() {
    const startScanButton = document.getElementById('start-scan');
    const stopScanButton = document.getElementById('stop-scan');
    const resultTableBody = document.querySelector('#result-table tbody');
    const qrCodeScanner = new Html5Qrcode("reader");
    
    let scannerRunning = false;

    startScanButton.addEventListener('click', function() {
        if (!scannerRunning) {
            // Use the default camera
            Html5Qrcode.getCameras().then(cameras => {
                if (cameras && cameras.length) {
                    let cameraId = cameras[0].id;
                    qrCodeScanner.start(
                        { facingMode: "environment" }, // Default camera
                        {
                            fps: 10, // Frame rate
                            qrbox: { width: 250, height: 250 } // QR code scanning box
                        },
                        qrCodeMessage => {
                            addResultToTable(qrCodeMessage);
                        }
                    ).then(() => {
                        scannerRunning = true;
                    }).catch(err => {
                        console.error(`Unable to start scanning, error: ${err}`);
                    });
                }
            }).catch(err => {
                console.error(`Error getting cameras: ${err}`);
            });
        }
    });

    stopScanButton.addEventListener('click', function() {
        if (scannerRunning) {
            qrCodeScanner.stop().then(() => {
                scannerRunning = false;
            }).catch(err => {
                console.error(`Unable to stop scanning, error: ${err}`);
            });
        }
    });

    function addResultToTable(qrCodeMessage) {
        const newRow = document.createElement('tr');
        const qrCodeDataCell = document.createElement('td');
        const timestampCell = document.createElement('td');

        qrCodeDataCell.textContent = qrCodeMessage;
        timestampCell.textContent = new Date().toLocaleString();

        newRow.appendChild(qrCodeDataCell);
        newRow.appendChild(timestampCell);
        resultTableBody.appendChild(newRow);
    }
});
