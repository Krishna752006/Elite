import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(" ");
        int[] arr = wow(st);
        int n = arr.length;
        int s = 0;
        for(int i = 0;i < 32;i++){
            int a = 0,b = 0;
            for(int j = 0;j<n;j++){
                if((arr[j] & 1) == 1)a++;
                else b++;
                arr[j] = arr[j] >> 1;
            }
            s += (a*b);
        }
        System.out.print(s);
    }
    static int[] wow(String[] st){
        int n = st.length;
        int arr[] = new int[n];
        for(int i = 0;i < n;i++){
            arr[i] = Integer.parseInt(st[i]);
        }
        return arr;
    }
}