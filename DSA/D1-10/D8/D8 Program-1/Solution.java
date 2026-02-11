import java.util.*;
class Solution{
    static int min;
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int arr[] = new int[n];
        for(int i = 0;i<n;i++){
            arr[i] = sc.nextInt();
        }
        min = n;
        help(arr,0,0);
        System.out.print(min);
    }
    static void help(int[] arr,int i,int s){
        if(i+1 == arr.length) {
            if(s<min) min = s;
            return;
        }
        for(int j = 1;j <= arr[i];j++){
            if(i+j < arr.length) help(arr,i+j,s+1);
        }
    }
}