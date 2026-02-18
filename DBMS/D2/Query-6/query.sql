/*
Write an SQL query to display all details of employees whose salary is greater 
than the salary of the employee named BLAKE.


Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+-------+-------+-----------+------+------------+---------+------+--------+
| empno | ename | job       | mgr  | hiredate   | sal     | comm | deptno |
+-------+-------+-----------+------+------------+---------+------+--------+
|  7566 | JONES | MANAGER   | 7839 | 1995-10-31 | 2975.00 | NULL |     20 |
|  7788 | SCOTT | ANALYST   | 7566 | 1996-03-05 | 3000.00 | NULL |     20 |
+-------+-------+-----------+------+------------+---------+------+--------+


*/

use fs;
SELECT * from emp where sal > (SELECT sal from emp where ename = "BLAKE");