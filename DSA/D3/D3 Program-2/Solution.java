import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Map<Integer,String> mp = new HashMap<>();
        System.out.print(help(n,mp));
    }
    static String help(int n, Map<Integer,String> mp){
        if(n == 0) return "";
        if(mp.containsKey(n)) return mp.get(n);
        if(n%2 != 0){
            String s1 = help(n/2,mp)+"0"; 
            mp.put(n,s1);
            return mp.get(n);
        }
        String s = help(n-1,mp);
        mp.put(n,s.substring(0,s.length()-1) + "1");
        return mp.get(n);
    }
}
// D Section Guy Solution in Java

// import java.util.*;
// class Solution1{
//     public static void main(String[] args){
//         Scanner sc = new Scanner(System.in);
//         int n = sc.nextInt();
//         String s = Integer.toBinaryString(n+1);
//         System.out.print(s.substring(1));
//     }
// }

//Actual Solution