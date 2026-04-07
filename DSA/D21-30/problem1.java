/*

Charlie Brown is working with strings,
He is a given a string S. He wants to find out the maximum substring 'MaxSub'.

MaxSub is a substring which appears atleast twice in S with Maximum length. 

Your task is to help Charlie Brown to find the Maximum Substring MaxSub,
and print the length of MaxSub. If there is MaxSub, return 0.

Input Format:
-------------
A string S.

Output Format:
--------------
Print an integer, length of MaxSub


Sample Input-1:
---------------
babababba

Sample Output-1:
----------------
5

Explanation: 
------------
The Maximum substring is 'babab' , which occurs 2 times.


Sample Input-2:
---------------
abbbbba

Sample Output-2:
----------------
4

Explanation: 
------------
The Maximum substring is 'bbbb' , which occurs 2 times.


Sample Input-3:
---------------
vignesh

Sample Output-3:
----------------
0

*/

import java.util.*;

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int n = s.length();

        String[] suffix = new String[n];
        for (int i = 0; i < n; i++) {
            suffix[i] = s.substring(i);
        }

        Arrays.sort(suffix);

        int maxLen = 0;

        for (int i = 1; i < n - 1; i++) {
            int len = lcp(suffix[i], suffix[i + 1]);
            maxLen = Math.max(maxLen, len);
        }

        System.out.println(maxLen);
    }

    static int lcp(String a, String b) {
        int len = Math.min(a.length(), b.length());
        int i = 0;
        while (i < len && a.charAt(i) == b.charAt(i)) {
            i++;
        }
        return i;
    }
}
