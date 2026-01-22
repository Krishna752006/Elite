import java.util.*;
class Solution{
    static int min = Integer.MAX_VALUE;
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int arr[][] = new int[n][3];
        for(int i = 0;i<n;i++){
            arr[i][0] = sc.nextInt();
            arr[i][1] = sc.nextInt();
            arr[i][2] = sc.nextInt();
        }
        help(arr,0,-1,0);
        System.out.print(min);
    }
    static void help(int[][] arr,int i,int t,int s){
        if(i == arr.length){
            if(s<min) min = s;
            return;
        }
        for(int j = 0;j < 3;j++){
            if(j != t) help(arr,i+1,j,s+arr[i][j]);
        }
    }
}