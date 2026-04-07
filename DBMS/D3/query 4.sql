/*
Identify employees who earn the lowest salary in each department.
If multiple employees share the same lowest salary, include all of them.


Tables:
------

emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+--------+--------+---------+-----+
| ename  | deptno | sal     | rnk |
+--------+--------+---------+-----+
| FORD   |     10 | 1300.00 |   1 |
| SMITH  |     20 |  800.00 |   1 |
+--------+--------+---------+-----+

*/

USE fs;

SELECT 
    ename,
    deptno,
    sal,
    rnk
FROM (
    SELECT 
        ename,
        deptno,
        sal,
        RANK() OVER (PARTITION BY deptno ORDER BY sal ASC) AS rnk
    FROM emp
) t
WHERE rnk = 1;