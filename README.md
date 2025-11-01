# DeepSurge-Hack-Thon-1.0
A working prototype that visualizes CSV data in real time after submitting the CSV file through your device.

 <--CSV Data Visualizer-->

## Overview
CSV Data Visualizer is a full-stack web application that allows users to upload CSV files, visualize data through interactive charts, and automatically generate insights like averages, maximums, and minimums. It integrates frontend visualization (using Chart.js) with a Node.js and MySQL backend for dynamic data storage.

---

 Features:-
-  **Login Page**: Simple user interface for access.
-  **CSV Upload**: Upload CSV files directly from your system.
-  **Interactive Charts**: Automatically generate bar, line, and pie charts using Chart.js.
-  **Insight Generation**: Compute and display key insights (Average, Max, Min) for each numerical column.
-  **Database Integration**: Data is dynamically stored in a MySQL database using Node.js (Express backend).
-  **Responsive UI**: Clean, user-friendly interface with flexible layout.

 Tech Stack:-
**Frontend:** HTML, CSS, JavaScript, Chart.js  
**Backend:** Node.js, Express.js  
**Database:** MySQL  


---

 How to Run the Project
###  Setup Backend
```bash
npm install
node server.js


##  DB SETUP ##

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=csv_visualizer






