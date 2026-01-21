import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int res = help(s,0);
        System.out.print(res);
    }
    static int help(String s,int k){
        if(k == s.length()){
            return 1;
        }
        if(s.charAt(k) == '0') return 0;
        int c = help(s,k+1);
        if(k+1 < s.length()){
            int v = (s.charAt(k) - '0')*10 + (s.charAt(k+1)-'0');
            if(v <= 26){
                c += help(s,k+2);
            }
        }
        return c;
    }
}

// you always try to do a void help recursion but sometimes returning a value is also usefull.