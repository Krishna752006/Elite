/*
Management wants to compare all employees across the company.
Assign a rank to employees based on salary across the entire company 
(not departmentwise). Employees with the same salary should share the same rank, 
and the next rank should be skipped.


Tables:
------
emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)

OUTPUT:
+--------+---------+-------------+                                                                                                                    
| ename  | sal     | global_rank |                                                                                                                    
+--------+---------+-------------+                                                                                                                    
| KEVIN  | 5000.00 |           1 |                                                                                                                    
| SCOTT  | 3000.00 |           2 |                                                                                                                    
| FORD   | 3000.00 |           2 |                                                                                                                    
+--------+---------+-------------+ 

*/

use fs;
select ename, sal, RANK() over (order by sal desc) as global_rank from emp;