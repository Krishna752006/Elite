/*
Write an SQL query to list employees who earn more than the average salary of 
their own department.


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
|  7698 | BLAKE | MANAGER   | 7839 | 1992-06-11 | 2850.00 | NULL |     30 |
+-------+-------+-----------+------+------------+---------+------+--------+


*/

use fs;
SELECT e.* from emp e where e.sal > (SELECT AVG(sal) from emp s where e.deptno = s.deptno);  
