/*
Write a SQL query to list the total salary and employee count per job, 
excluding clerks.


Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)

OUTPUT:
+-----------+----------+----------+
| job       | SUM(sal) | COUNT(*) |
+-----------+----------+----------+
| SALESMAN  |  5600.00 |        4 |
| MANAGER   |  8275.00 |        3 |
+-----------+----------+----------+

*/
use fs;
Select job, SUM(sal), COUNT(*) from emp group by job having job != "CLERK";