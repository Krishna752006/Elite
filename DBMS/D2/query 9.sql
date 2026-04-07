/*
Write an SQL query to display employees whose salary is greater than the salary 
of their respective manager.


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
|  7902 | FORD  | ANALYST | 7566 | 1997-12-05 | 3000.00 | NULL |     20 |
+-------+-------+---------+------+------------+---------+------+--------+


*/

use fs;
SELECT e.* from emp e join emp m on e.mgr = m.empno where e.sal > m.sal;