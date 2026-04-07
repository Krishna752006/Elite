/*
Write an SQL query to list all employees who have the same job designation as 
the employee named ALLEN.


Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+-------+--------+----------+------+------------+---------+---------+--------+
| empno | ename  | job      | mgr  | hiredate   | sal     | comm    | deptno |
+-------+--------+----------+------+------------+---------+---------+--------+
|  7499 | ALLEN  | SALESMAN | 7698 | 1998-08-15 | 1600.00 |  300.00 |     10 |
|  7844 | KEVIN  | SALESMAN | 7698 | 1995-06-04 | 1500.00 |    0.00 |     30 |
+-------+--------+----------+------+------------+---------+---------+--------+


*/

use fs;
SELECT * from emp where job in (SELECT job from emp WHERE ename = "ALLEN");