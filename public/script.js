// Global variables to store charts
let barChart, lineChart, pieChart;

// Function to process CSV file
async function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const data = parseCSV(csvData);
        visualizeData(data);
        generateInsights(data);
    };
    reader.readAsText(file);
}

// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = isNaN(values[index]) ? values[index] : parseFloat(values[index]);
        });
        
        data.push(row);
    }

    return data;
}

// Function to visualize data
function visualizeData(data) {
    // Destroy existing charts
    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();

    // Get numerical columns for visualization
    const numericalColumns = Object.keys(data[0]).filter(key => 
        typeof data[0][key] === 'number'
    );

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: data.map((_, index) => `Entry ${index + 1}`),
            datasets: [{
                label: numericalColumns[0] || 'Data',
                data: data.map(row => row[numericalColumns[0]]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Bar Chart Analysis'
                }
            }
        }
    });

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: data.map((_, index) => `Entry ${index + 1}`),
            datasets: [{
                label: numericalColumns[1] || 'Trend',
                data: data.map(row => row[numericalColumns[1]]),
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Trend Analysis'
                }
            }
        }
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: data.slice(0, 5).map((_, index) => `Category ${index + 1}`),
            datasets: [{
                data: data.slice(0, 5).map(row => row[numericalColumns[2]]),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution Analysis'
                }
            }
        }
    });
}

// Function to generate insights
function generateInsights(data) {
    const insightsDiv = document.getElementById('insights');
    insightsDiv.innerHTML = '';

    // Get numerical columns
    const numericalColumns = Object.keys(data[0]).filter(key => 
        typeof data[0][key] === 'number'
    );

    numericalColumns.forEach(column => {
        const values = data.map(row => row[column]);
        
        // Calculate basic statistics
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        // Add insights
        const insightHTML = `
            <div class="insight-item">
                <h3>${column}</h3>
                <p>Average: ${avg.toFixed(2)}</p>
                <p>Maximum: ${max}</p>
                <p>Minimum: ${min}</p>
            </div>
        `;
        insightsDiv.innerHTML += insightHTML;
    });
}
// ... (keep existing code until processCSV function) ...

async function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        const csvData = event.target.result;
        const data = parseCSV(csvData);
        
        try {
            // Create table with columns
            await fetch('http://localhost:3000/api/create-table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ columns: Object.keys(data[0]) })
            });

            // Save data
            await fetch('http://localhost:3000/api/save-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            visualizeData(data);
            generateInsights(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing data');
        }
    };
    reader.readAsText(file);
}