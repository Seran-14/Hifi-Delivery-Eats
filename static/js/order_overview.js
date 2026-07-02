// Global chart variables
let statusChart = null;
let weeklyChart = null;
let monthlyChart = null;
let yearlyChart = null;

// Chart color configurations
const chartColors = {
    'On Time': {
        border: '#32CD32',
        background: 'rgba(50, 205, 50, 0.2)'
    },
    'Slightly Delayed': {
        border: '#FFD700',
        background: 'rgba(255, 215, 0, 0.2)'
    },
    'Delayed': {
        border: '#8A2BE2',
        background: 'rgba(138, 43, 226, 0.2)'
    },
    'Over Delayed': {
        border: '#FF0000',
        background: 'rgba(255, 0, 0, 0.2)'
    }
};

// --- DUMMY API SECTION ---
// Simulates fetching data from a backend

function getDummyOrderStats() {
    console.log("Fetching dummy order stats...");
    return Promise.resolve({
        total_orders: Math.floor(Math.random() * 2000) + 1000,
        yearly_orders: Math.floor(Math.random() * 500) + 200,
        monthly_orders: Math.floor(Math.random() * 100) + 20,
        daily_orders: Math.floor(Math.random() * 20) + 1
    });
}

function getDummyDailyStatus(date) {
    console.log(`Fetching dummy daily status for: ${date}`);
    // Data for doughnut chart
    return Promise.resolve({
        labels: ['On Time', 'Slightly Delayed', 'Delayed', 'Over Delayed'],
        data: [
            Math.floor(Math.random() * 60) + 20, // On Time
            Math.floor(Math.random() * 30) + 5,  // Slightly Delayed
            Math.floor(Math.random() * 15) + 2,  // Delayed
            Math.floor(Math.random() * 10) + 1   // Over Delayed
        ]
    });
}

function getDummyWeeklyStatus(date) {
    console.log(`Fetching dummy weekly status for: ${date}`);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Data for radar chart
    return Promise.resolve({
        labels: daysOfWeek,
        datasets: [
            {
                label: 'On Time',
                data: daysOfWeek.map(() => Math.floor(Math.random() * 25) + 5)
            },
            {
                label: 'Slightly Delayed',
                data: daysOfWeek.map(() => Math.floor(Math.random() * 15) + 2)
            },
            {
                label: 'Delayed',
                data: daysOfWeek.map(() => Math.floor(Math.random() * 10))
            },
            {
                label: 'Over Delayed',
                data: daysOfWeek.map(() => Math.floor(Math.random() * 5))
            }
        ]
    });
}

function getDummyMonthlyStatus(monthYear) { // monthYear format: "YYYY-MM"
    console.log(`Fetching dummy monthly status for: ${monthYear}`);
    const year = parseInt(monthYear.split('-')[0]);
    const month = parseInt(monthYear.split('-')[1]);
    const daysInMonthCount = new Date(year, month, 0).getDate(); // Get actual days in selected month
    const daysLabels = Array.from({ length: daysInMonthCount }, (_, i) => (i + 1).toString());

    // Data for line chart
    return Promise.resolve({
        labels: daysLabels,
        datasets: [
            {
                label: 'On Time',
                data: daysLabels.map(() => Math.floor(Math.random() * 20) + 3)
            },
            {
                label: 'Slightly Delayed',
                data: daysLabels.map(() => Math.floor(Math.random() * 10) + 1)
            },
            {
                label: 'Delayed',
                data: daysLabels.map(() => Math.floor(Math.random() * 8))
            },
            {
                label: 'Over Delayed',
                data: daysLabels.map(() => Math.floor(Math.random() * 5))
            }
        ]
    });
}

function getDummyYearlyStatus(year) {
    console.log(`Fetching dummy yearly status for: ${year}`);
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Data for bar chart
    return Promise.resolve({
        labels: monthLabels,
        datasets: [
            {
                label: 'On Time',
                data: monthLabels.map(() => Math.floor(Math.random() * 150) + 50)
            },
            {
                label: 'Slightly Delayed',
                data: monthLabels.map(() => Math.floor(Math.random() * 80) + 20)
            },
            {
                label: 'Delayed',
                data: monthLabels.map(() => Math.floor(Math.random() * 40) + 5)
            },
            {
                label: 'Over Delayed',
                data: monthLabels.map(() => Math.floor(Math.random() * 20))
            }
        ]
    });
}

// --- END DUMMY API SECTION ---


// Initialize date controls
function initializeDateControls() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Set up year picker
    const yearPicker = document.getElementById('yearPicker');
    if (!yearPicker) { console.error("Element with ID 'yearPicker' not found."); return; }
    yearPicker.innerHTML = ''; // Clear existing options

    for (let year = currentYear; year >= currentYear - 2; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearPicker.appendChild(option);
    }

    // Set up month picker with last 12 months
    const monthPicker = document.getElementById('monthPicker');
    if (!monthPicker) { console.error("Element with ID 'monthPicker' not found."); return; }
    monthPicker.innerHTML = ''; // Clear existing options

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(currentDate.getMonth() - i);

        const option = document.createElement('option');
        const year = d.getFullYear();
        const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');

        option.value = `${year}-${monthNum}`;
        option.textContent = `${months[d.getMonth()]} ${year}`;
        if (i === 0) {
            option.selected = true;
        }
        monthPicker.appendChild(option);
    }

    // Set up daily and weekly date pickers
    const dailyDatePicker = document.getElementById('dailyDatePicker');
    const weeklyDatePicker = document.getElementById('weeklyDatePicker');

    if (dailyDatePicker) {
        dailyDatePicker.value = currentDate.toISOString().split('T')[0];
        dailyDatePicker.max = currentDate.toISOString().split('T')[0];
    } else {
        console.error("Element with ID 'dailyDatePicker' not found.");
    }

    if (weeklyDatePicker) {
        weeklyDatePicker.value = currentDate.toISOString().split('T')[0];
        weeklyDatePicker.max = currentDate.toISOString().split('T')[0];
    } else {
        console.error("Element with ID 'weeklyDatePicker' not found.");
    }
}

// Fetch and update order statistics
function updateOrderStats() {
    getDummyOrderStats() // Replaced fetch
        .then(data => {
            const totalEl = document.querySelector('.green .stat-value');
            const yearlyEl = document.querySelector('.pink .stat-value');
            const monthlyEl = document.querySelector('.purple .stat-value');
            const dailyEl = document.querySelector('.blue .stat-value');

            if (totalEl) totalEl.textContent = data.total_orders;
            else console.error("Element '.green .stat-value' not found for total orders.");
            if (yearlyEl) yearlyEl.textContent = data.yearly_orders;
            else console.error("Element '.pink .stat-value' not found for yearly orders.");
            if (monthlyEl) monthlyEl.textContent = data.monthly_orders;
            else console.error("Element '.purple .stat-value' not found for monthly orders.");
            if (dailyEl) dailyEl.textContent = data.daily_orders;
            else console.error("Element '.blue .stat-value' not found for daily orders.");
        })
        .catch(error => console.error('Error fetching order stats:', error));
}

// Update daily status chart
function updateDailyStatusChart(date) {
    getDummyDailyStatus(date) // Replaced fetch
        .then(data => {
            const statusChartCtx = document.getElementById('statusChart');
            if (!statusChartCtx) { console.error("Canvas with ID 'statusChart' not found."); return; }
            const ctx = statusChartCtx.getContext('2d');

            if (statusChart) {
                statusChart.destroy();
            }

            statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.data,
                        backgroundColor: data.labels.map(label => chartColors[label] ? chartColors[label].border : '#cccccc') // Use border as bg for doughnut
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `Today's Delivery Status (${date})`
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error updating daily status:', error));
}

// Update weekly status chart
function updateWeeklyChart(date) {
    getDummyWeeklyStatus(date) // Replaced fetch
        .then(data => {
            const weeklyChartCtx = document.getElementById('weeklyChart');
            if (!weeklyChartCtx) { console.error("Canvas with ID 'weeklyChart' not found."); return; }
            const ctx = weeklyChartCtx.getContext('2d');

            const allDataPoints = data.datasets.flatMap(ds => ds.data);
            const maxValue = allDataPoints.length > 0 ? Math.max(...allDataPoints) : 10; // Default max if no data
            const stepSize = maxValue > 0 ? Math.ceil(maxValue / 5) : 1; // Avoid stepSize 0

            if (weeklyChart) {
                weeklyChart.destroy();
            }

            weeklyChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        borderColor: chartColors[ds.label] ? chartColors[ds.label].border : '#cccccc',
                        backgroundColor: chartColors[ds.label] ? chartColors[ds.label].background : 'rgba(204,204,204,0.2)',
                        fill: true
                    }))
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            suggestedMax: maxValue + stepSize, // Ensure scale is slightly larger than max data
                            ticks: {
                                stepSize: stepSize,
                                font: {
                                    size: 10 // Adjusted for potentially smaller radar charts
                                }
                            },
                            pointLabels: {
                                font: {
                                    size: 12 // Adjusted for point labels
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Weekly Delivery Status'
                        }
                    }
                }
            });

            // Update week range display
            const weekRangeEl = document.getElementById('weekRange');
            if (weekRangeEl) {
                const selectedDate = new Date(date + "T00:00:00"); // Ensure date is parsed correctly, add time to avoid UTC issues
                const dayOfWeek = selectedDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

                const weekStartDate = new Date(selectedDate);
                weekStartDate.setDate(selectedDate.getDate() - dayOfWeek);

                const weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekStartDate.getDate() + 6);

                weekRangeEl.textContent =
                    `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;
            } else {
                console.error("Element with ID 'weekRange' not found.");
            }
        })
        .catch(error => console.error('Error updating weekly status:', error));
}

// Update monthly status chart
function updateMonthlyChart(monthYear) { // monthYear format "YYYY-MM"
    getDummyMonthlyStatus(monthYear) // Replaced fetch
        .then(data => {
            const monthlyChartCtx = document.getElementById('monthlyChart');
            if (!monthlyChartCtx) { console.error("Canvas with ID 'monthlyChart' not found."); return; }
            const ctx = monthlyChartCtx.getContext('2d');

            if (monthlyChart) {
                monthlyChart.destroy();
            }

            monthlyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        borderColor: chartColors[ds.label] ? chartColors[ds.label].border : '#cccccc',
                        backgroundColor: chartColors[ds.label] ? chartColors[ds.label].background : 'rgba(204,204,204,0.2)', // usually not used for line if fill is false
                        tension: 0.1, // Smoothed line
                        fill: false // Line charts often look better without fill
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { font: { size: 12 } }
                        },
                        x: {
                            ticks: { font: { size: 12 } }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `Monthly Delivery Status (${monthYear})`
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error updating monthly status:', error));
}

// Update yearly status chart
function updateYearlyChart(year) {
    getDummyYearlyStatus(year) // Replaced fetch
        .then(data => {
            const yearlyChartCtx = document.getElementById('yearlyChart');
            if (!yearlyChartCtx) { console.error("Canvas with ID 'yearlyChart' not found."); return; }
            const ctx = yearlyChartCtx.getContext('2d');

            if (yearlyChart) {
                yearlyChart.destroy();
            }

            yearlyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        backgroundColor: chartColors[ds.label] ? chartColors[ds.label].border : '#cccccc' // For bar, border color usually works well as bg
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            stacked: true
                        },
                        x: {
                            stacked: true,
                            ticks: { font: { size: 12 } }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `Yearly Delivery Status (${year})`
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error updating yearly status:', error));
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error("Chart.js is not loaded. Make sure to include it before this script.");
        // Optionally, display a message to the user on the page
        const body = document.querySelector('body');
        if (body) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = "Error: Chart.js library is missing. Charts cannot be displayed.";
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '20px';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.fontWeight = 'bold';
            body.insertBefore(errorDiv, body.firstChild);
        }
        return; // Stop further execution if Chart.js is missing
    }

    initializeDateControls();
    updateOrderStats(); // Will use dummy data

    const currentDate = new Date().toISOString().split('T')[0];
    const currentMonthYear = document.getElementById('monthPicker') ? document.getElementById('monthPicker').value : `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
    const currentYear = document.getElementById('yearPicker') ? document.getElementById('yearPicker').value : new Date().getFullYear().toString();

    updateDailyStatusChart(currentDate);
    updateWeeklyChart(currentDate);
    updateMonthlyChart(currentMonthYear);
    updateYearlyChart(currentYear);

    // Set up event listeners for date controls
    const dailyPicker = document.getElementById('dailyDatePicker');
    if (dailyPicker) {
        dailyPicker.addEventListener('change', function(e) {
            updateDailyStatusChart(e.target.value);
        });
    }

    const weeklyPicker = document.getElementById('weeklyDatePicker');
    if (weeklyPicker) {
        weeklyPicker.addEventListener('change', function(e) {
            updateWeeklyChart(e.target.value);
        });
    }

    const monthPickerEl = document.getElementById('monthPicker');
    if (monthPickerEl) {
        monthPickerEl.addEventListener('change', function(e) {
            updateMonthlyChart(e.target.value);
        });
    }

    const yearPickerEl = document.getElementById('yearPicker');
    if (yearPickerEl) {
        yearPickerEl.addEventListener('change', function(e) {
            updateYearlyChart(e.target.value);
        });
    }
});