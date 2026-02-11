import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for(int i = 0;i<n;i++){
            arr[i] = sc.nextInt();
        }
        Set<Integer> li = new HashSet<>();
        help(arr,0,li,0);
        int s = 0;
        for(int i: li){
            s = s | i;
        }
        System.out.print(s);
    }
    static void help(int[] arr,int i,Set<Integer> li,int s){
        if(i == arr.length){
            li.add(s);
            return;
        }
        help(arr,i+1,li,s+arr[i]);
        help(arr,i+1,li,s);
    }
}