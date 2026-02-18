import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(" ");
        int arr[] = help(st);
        int a = 0;
        for(int i:arr){
            a ^= i;
        }
        int b = a & -a;
        int s1 = 0,s2 = 0;
        for(int i: arr){
            if((i&b) == 0)
            s1 ^= i;
            else
            s2 ^= i;
        }
        if(s1>s2){
            int temp = s2;
            s2 = s1;
            s1 = temp;
        }
        System.out.print(s1 + " " + s2);
    }
    static int[] help(String[] st){
        int n = st.length;
        int[] arr = new int[n];
        for(int i = 0;i < n;i++){
            arr[i] = Integer.parseInt(st[i]);
        }
        return arr;
    }
}