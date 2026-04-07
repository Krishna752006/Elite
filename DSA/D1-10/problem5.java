/*

Amogh is an Antiquarian, The person who collects antiques.
He found a rear keyboard which has following keys,
Keys are 'N', 'S', 'C' and 'P'

1st Key - 'N': Print one character 'N' on Console.
2nd Key - 'S': Select the whole Console.
3rd Key - 'C': Copy selected content to buffer.
4th Key - 'P': Print the buffer on Console, and append it after what has 
already been printed.

Now, your task is to find out maximum numbers of 'N's you can print
after K keystrokes . 

Input Format:
-------------
An integer K

Output Format:
--------------
Print an integer, maximum numbers of 'N's you can print.


Sample Input-1:
-------------------
3

Sample Output-1:
-------------------- 
3

Explanation: 
---------------
We can print at most get 3 N's on console by pressing following key sequence:
N, N, N



Sample Input-2:
-------------------
7

Sample Output-2:
---------------------
9

Explanation: 
---------------
We can print at most get 9 N's on console by pressing following key sequence:
N, N, N, S, C, P, P


/*

import java.util.*;
class Solution{
    static int max = 0;
    // static Map<String, Integer> mp = new HashMap<>();
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        help(k,0,false,0);
        System.out.print(max);
    }
    static void help(int k,int c,boolean sel,int cn){
        if(k <= 0){
            if(c>max) max = c;
            return;
        }
        // String a = k + "|" + sel + "|" + cn;
        // if(mp.containsKey(a) && mp.get(a)>=c) return;
        // mp.put(a,c);
        if(sel){
            int l = c+cn;
            help(k-1,l,sel,cn);
            if(k>2) help(k-2,c,sel,c);
            return;
        }
        help(k-1,c+1,false,cn+1);
        if(k>2)help(k-2,c,true,cn);
    }
}