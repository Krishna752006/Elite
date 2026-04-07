/*
Within each department, assign ranks to employees based on salary such that employees
with equal salaries share the same rank, and ranks are consecutive without gaps.


Tables:
------

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+--------+--------+---------+----------------+
| ename  | deptno | sal     | dept_dense_ran |
+--------+--------+---------+----------------+
| CLARK  |     10 | 2450.00 |              1 |
| ALLEN  |     10 | 1600.00 |              2 |
| FORD   |     10 | 1300.00 |              3 |
+--------+--------+---------+----------------+

*/

USE fs;

SELECT 
    ename,
    deptno,
    sal,
    DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS dept_dense_ran
FROM emp
ORDER BY deptno, sal DESC;