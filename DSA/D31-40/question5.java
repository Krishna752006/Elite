/*
A university maintains a file named students.txt containing student records in 
the following format:

SNo-RollNo-Name
1-23bd1a0502-Adepu Raviteja
2-23bd1a0504-Adithya Kandala
...
201-23P81A0509-BOJJA NIKHILESH

Each Roll Number encodes important information about the student such as college, 
admission type, and department.

You are required to analyze the roll numbers and compute several statistics.

Roll Number Encoding Rules: YYCCCCDDSS, Where specific character positions 
represent:

Position	        Meaning
----------------------------
3rd–4th characters	College Code
5th–6th characters	Admission Type
7th–8th characters	Department Code

College Codes:
--------------
Code	College
---------------
BD	    KMIT
P8	    KMCE

Admission Type Codes:
---------------------
Code	Type
-------------
1A	    Regular
5A	    Lateral Entry

Department Codes:
-----------------
Code	Department
------------------
05	    CSE
12	    IT
66	    CSM
67	    CSD
62	    CSC
69	    CSI

Write a Java program thatrReads an integer N from the user.
Processes only the first N students from the file "students.txt"
Extracts information from each student's roll number.

Input Format
Integer N

Output Format:
As described in sample.

Sample Input:
-------------
50

Sample Output:
--------------
College Wise Students:
KMCE : 7
KMIT : 43
Department Wise Students:
KMCE
CSC : 1
CSE : 4
CSD : 2
KMIT
CSE : 28
CSD : 3
IT : 3
CSM : 9
Admission Type:
Regular Students : 49
Lateral Students : 1



Constraints:
1 ≤ N ≤ 236
*/