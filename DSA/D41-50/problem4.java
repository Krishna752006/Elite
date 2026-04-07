/*

You are designing an autonomous surveillance drone that operates 
over an infinite 2D grid representing terrain coordinates.

The drone starts at position (0, 0).

In a single step, the drone can move in an L-shaped pattern. From 
a position (p, q), it can move to any of the following positions:
(p − 2, q − 1), (p − 2, q + 1), (p + 2, q − 1), (p + 2, q + 1)
(p − 1, q + 2), (p + 1, q + 2), (p − 1, q − 2), (p + 1, q − 2)

Given two integers m and n, representing the target position (m, n), determine:
The minimum number of steps required for the drone to reach the target 
from (0, 0).


Input Format:
-----------------
Two space separated integers, m and n, position.

Output Format:
------------------
Print an integer, minimum number of steps to reach (m,n).


Sample Input-1:
---------------
2 4

Sample Output-1:
----------------
2

Explanation:
-------------
Initially, you are at (0,0) position, you can reach (2,4) as follows:
(0,0) -> (1, 2) -> (2, 4) 


Sample Input-2:
---------------
4 7

Sample Output-2:
----------------
5

Explanation:
------------
Initially, you are at (0,0) position, you can reach (4,7) as follows:
(0,0) -> (1, 2) -> (2, 4) -> (1, 6) -> (3, 5) -> (4, 7)

*/
import java.util.*;
class Solution {
    static int[][] arr = {{1,2},{1,-2},{2,1},{2,-1},{-1,2},{-1,-2},{-2,1},{-2,-1}};
    static class Node {
        int x, y, c;
        Node(int x, int y, int c) {
            this.x = x;
            this.y = y;
            this.c = c;
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        System.out.println(minc(m, n));
    }
    static int minc(int m, int n) {
        m = Math.abs(m);
        n = Math.abs(n);
        Queue<Node> q = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        q.add(new Node(0, 0, 0));
        visited.add("0,0");
        while (!q.isEmpty()) {
            Node curr = q.poll();
            if (curr.x == m && curr.y == n) return curr.c;
            for (int[] k : arr) {
                int nx = curr.x + k[0];
                int ny = curr.y + k[1];
                if (nx >= -2 && ny >= -2 && nx <= m + 2 && ny <= n + 2) 
                {
                    String key = nx + "," + ny;
                    if (!visited.contains(key)) 
                    {
                        visited.add(key);
                        q.add(new Node(nx, ny, curr.c + 1));
                    }
                }
            }
        }
        return -1;
    }
}