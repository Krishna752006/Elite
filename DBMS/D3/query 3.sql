/*
Assign ranks to employees based on salary such that if multiple employees have 
the same salary, they receive the same rank, and no ranks are skipped.


Tables:
------

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+--------+---------+------------+
| ename  | sal     | dense_rank |
+--------+---------+------------+
| KEVIN  | 5000.00 |          1 |
| SCOTT  | 3000.00 |          2 |
| FORD   | 3000.00 |          2 |
+--------+---------+------------+

*/
USE fs;

SELECT 
    ename,
    sal,
    DENSE_RANK() OVER (ORDER BY sal DESC) AS 'dense_rank'
FROM emp
ORDER BY sal DESC;
