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