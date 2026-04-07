/*
Find employees who fall under the same salary rank category (rank 1 or rank 2) 
within their respective departments. This helps identify top and mid-level 
performers across all departments.


Tables:
------
emp ==>   empno int(4) primary key, ename varchar(50) not null,
          job varchar(50) not null,  mgr int(4),  hiredate date,
          sal decimal(10,2),  comm decimal(10,2),  deptno int(2)


OUTPUT:
+--------+--------+---------+-----+
| ename  | deptno | sal     | rnk |
+--------+--------+---------+-----+
| CLARK  |     10 | 2450.00 |   1 |
| ALLEN  |     10 | 1600.00 |   2 |
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
        DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rnk
    FROM emp
) t
WHERE rnk <= 2
ORDER BY deptno, rnk, sal DESC;