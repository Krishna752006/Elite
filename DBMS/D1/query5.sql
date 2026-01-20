/*
Write a SQL query to list employee names and department names where 
the department is in 'Chicago' using INNER JOIN.


Tables:
------
salgrade ==> grade int(4) primary key, losal decimal(10,2),  hisal decimal(10,2) 


dept==>   deptno int(2) primary key, dname varchar(50) not null, location varchar(50) not null

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)

OUTPUT:
+-------+-------+
| ename | dname |
+-------+-------+
| ALLEN | Sales |
| BLAKE | Sales |
+-------+-------+



*/

use fs;
Select e.ename, d.dname from emp e inner join dept d on e.deptno = d.deptno where d.location = "Chicago";