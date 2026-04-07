/*

Swiss Castle bakers has recivied P orders of cakes, and each cake has 
to filled with Q types of creams. To prepare varieties of creams, each 
variety takes different amounts of time in minutes, where i-th variety 
takes time[i] minutes.

You need to prepare P cakes. To prepare a cake, you need to use Q adjacent 
creams from the cook. The cook can prepare N varieties of creams, the i-th 
variety will be ready in time[i] minutes, and then you can use it to fill 
the cake.  [ Note: you can use each variety only once ].
 
Your task is to find and return the minimum time (in minutes) required, 
to prepare P cakes filled with Q types of creams. If it is impossible to 
prepare P cakes, print -1.


Input Format:
-------------
Line-1: Three space separated integers, N, P and Q.
Line-2: N space separated integers, time[].

Output Format:
--------------
Print an integer result.


Sample Input-1:
---------------
6 2 2
3 7 2 2 4 8

Sample Output-1:
----------------
7

Explanation:
-------------
* means not ready, R means ready.
Minute-1: * * * * * *
Minute-2: * * R R * *
Minute-3: R * R R * *
Minute-4: R * R R R *
Minute-5: R * R R R *
Minute-6: R * R R R *
Minute-7: R R R R R *
Now you can create two cakes with two varieties of fillings
Cake-1 can use variety-2 and variety-3
Cake-2 can use variety-0 and variety-1.

Sample Input-2:
---------------
5 3 2
2 3 5 3 4

Sample Output-2:
----------------
-1

Explanation:
------------
We need 6 varieties of creams to prepare 3 cakes.
We have only 5 varieties, so not possible. Print -1.


*/

import java.util.*;
class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int p = sc.nextInt();
        int q = sc.nextInt();
        int arr[] = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        if (p * q > n) {
            System.out.print(-1);
            return;
        }
        int lo = 1, hi = 0;
        for (int x : arr) hi = Math.max(hi, x);
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi-lo) / 2;
            if (canMake(arr, n, p, q, mid)) {
                ans = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        System.out.print(ans);
    }
    static boolean canMake(int[] arr, int n, int p, int q, int t) {
        int cakes = 0;
        int i = 0;
        while (i <= n - q) {
            boolean valid = true;
            for (int j = i; j < i + q; j++) {
                if (arr[j] > t) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                cakes++;
                i += q;
                if (cakes == p) return true;
            } else {
                i++;
            }
        }
        return false;
    }
}