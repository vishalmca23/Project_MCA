<h1><center><i>Doctor Medical Collaboration</i></center></h1>

The purpose of developing <center><i>Doctor Medical Collaboration</i></center> is to make ease for both doctor and patient to communicate easily and maintain records of each patient.

<h2>Roles Defined</h2>

1. Admin
2. Doctor
3. Patient
4. Medicine Supplier

<h2>Features</h2>

1. Login for each role.
2. Registration for Doctors, Patients and Medicine Suppliers.
3. Doctor - patient appointment.
4. Maintain patient history.
5. Order medicines.

<h2>Patient Functionalities</h2>

1. Patient can Register.
2. Patient can Login.
3. After Login they can see the list of doctors.
4. Can select any doctor and raise appointment request.
5. Either doctor approves or reject patient request patient is notified.
6. Patient can order medicines from clinic medical store and suppliers.

<h2>Doctor Functionalities</h2>

1. Doctor can Register.
2. Doctor can Login.
3. After Login they can see patient's appointment requests.
4. They can approve or reject appointment request.
5. If doctor approves then they will be able to see patient’s history and upload report.

<h2>Medicine Supplier Functionality</h2>

1. Supplier can Register.
2. Supplier can Login.
3. Supplier can view Patient's orders details.
4. Supplier can mark order delivered.

<h2>Admin Functionalities</h2>

1. Admin can Login.
2. Admin verifies Doctors and medicine suppliers after their registration .
3. Admin can add medicines to clinic medical store.

<h1> To run <center><i>Doctor Medical Collaboration</i></center></h1>

<h3>Prerequisite</h3>

1. Move in to directory DOC-MED-CO using command :

```
cd DOC-MED-CO
```

2. Install package dependecies using command : 

``` 
npm install
```

3. Create database 'DOC-MED-CO' in postgreSQL

```
psql postgres
create database "DOC-MED-CO";
```

4. Set database configurations in config file

5. Run migrations to create tables

```
npm run migration
```

<h1>Command to run</h1>

```
npm start
```

<h2> Base End Point</h2>

```
http://localhost:3000/
```
