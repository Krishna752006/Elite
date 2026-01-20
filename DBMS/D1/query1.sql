/*
Write a SQL query to find the average salary and number of employees per 
department, ordered by average salary in descending order.

Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:

+--------+-------------+----------+                                                                                                                   
| deptno | AVG(sal)    | COUNT(*) |                                                                                                                   
+--------+-------------+----------+                                                                                                                   
|     40 | 3125.000000 |        2 |                                                                                                                   
|     20 | 1970.833333 |        6 |                                                                                                                   
+--------+-------------+----------+ 

*/
use fs;
Select deptno, AVG(sal), COUNT(*) from emp group by deptno order by AVG(sal) DESC;