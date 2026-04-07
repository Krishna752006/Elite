/*

You are given some tokens printed with unique numbers on it and an integer T.
Your task is to find the least number of tokens that you need to make up the 
value T, by adding the numbers printed on all the tokens. 
If you cannot make the value T, by any combination of the tokens, return -1.

NOTE: Assume that you have unlimited set of tokens of each number type.

Input Format:
-------------
Line-1: Space separated integers tokens[], number printed on tokens.
Line-2: An integer T.

Output Format:
--------------
Print an integer, minimum number of tokens to make the value T.


Sample Input-1:
---------------
1 2 5
11

Sample Output-1:
----------------
3

Explanation:
------------
5+5+1 = 11


Sample Input-2:
---------------
2 4
15

Sample Output-2:
----------------
-1


*/

import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] tok = sc.nextLine().split("\\s+");
        int n = tok.length;
        int[] arr = new int[n];
        for(int i=0;i<n;i++){
            arr[i] = Integer.parseInt(tok[i]);
        }
        int T = sc.nextInt();
        int[] dp = new int[T+1];
        Arrays.fill(dp, T+1);
        dp[0] = 0;
        for(int j : arr){
            for(int i=j;i<=T;i++){
                dp[i] = Math.min(dp[i], dp[i-j] + 1);
            }
        }
        if(dp[T] == T+1) System.out.println(-1);
        else System.out.println(dp[T]);
    }
}