/*

You are working in a genetics laboratory where you are tasked with correcting 
DNA sequences. Each DNA strand is represented as a sequence of characters 'A', 
'C', 'G', and 'T'. Sometimes, due to mutations or errors during sequencing, the 
DNA strand (originalDNA) must be modified to match a targetDNA sequence exactly.

You can perform the following mutation operations:
- Insert a nucleotide (A, C, G, or T) into the DNA strand.
- Delete a nucleotide from the DNA strand.
- Replace a nucleotide with another one.

Each operation counts as one step.

Your task is to find the minimum number of mutation operations needed to 
transform the originalDNA into the targetDNA.

Input format:
-------------
2 space seperated strings, originalDNA, targetDNA

Output format:
--------------
An integer, the minimum number of mutation operations


Example 1:
-----------
Input:
ACGT AGT

Output:
1

Explanation:
Delete 'C': "ACGT" → "AGT"
Only 1 mutation is needed.

Example 2:
----------
Input:
GATTAC GCATGCU

Output:
4

Explanation:
- Replace 'A' with 'C': "GATTAC" → "GCTTAC"
- Replace 'T' with 'A': "GCTTAC" → "GCATAC"
- Replace 'A' with 'G': "GCATAC" → "GCATGC"
- Insert 'U' at the end: "GCATGC" → "GCATGCU"

Thus, 4 mutations are needed.


*/
import java.util.*;
class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        int l1 = a.length();
        int l2 = b.length();
        int[][] dp = new int[l1 + 1][l2 + 1];
        for (int i = 0; i <= l1; i++)
            dp[i][0] = i;
        for (int j = 0; j <= l2; j++)
            dp[0][j] = j;
        for (int i = 1; i <= l1; i++) {
            for (int j = 1; j <= l2; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int insert = dp[i][j - 1];
                    int delete = dp[i - 1][j];
                    int replace = dp[i - 1][j - 1];
                    dp[i][j] = 1 + Math.min(insert, Math.min(delete, replace));
                }
            }
        }
        System.out.println(dp[l1][l2]);
    }
}