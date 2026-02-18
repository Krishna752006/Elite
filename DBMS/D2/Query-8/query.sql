/*
Write an SQL query to find the employee(s) who earn the second highest salary 
in the company.


Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+-------+-------+---------+------+------------+---------+------+--------+
| empno | ename | job     | mgr  | hiredate   | sal     | comm | deptno |
+-------+-------+---------+------+------------+---------+------+--------+
|  7788 | SCOTT | ANALYST | 7566 | 1996-03-05 | 3000.00 | NULL |     20 |
+-------+-------+---------+------+------------+---------+------+--------+


*/

use fs;
SELECT * from emp where sal = (SELECT DISTINCT sal from emp order by sal desc limit 1 offset 1);