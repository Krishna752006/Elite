import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String[] st = sc.nextLine().split(" ");
        Arrays.sort(st,(a,b) -> a.length() - b.length());
        int n = s.length();
        for(int i = 0;i<n;i++){
            for(String w: st){
                int l = w.length();
                if(i+l <= n && s.startsWith(w,i)) System.out.println(i + " " + (l+i-1));
            }
        }
    }
}