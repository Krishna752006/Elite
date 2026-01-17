import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int arr[][] = new int[n][n];
        boolean visited[] = new boolean[n];
        for(int i = 0;i<n;i++){
            for(int j = 0;j<n;j++){
                arr[i][j] = sc.nextInt();
            }
        }
        int c = 0;
        for(int i = 0;i<n;i++){
            if(!visited[i]){
                c++;
                help(arr,i,visited,n);
            }
        }
        System.out.print(c);
    }
    public static void help(int[][] arr,int i,boolean[] visited,int n){
        visited[i] = true;
        for(int j = 0;j<n;j++){
            if(arr[i][j] == 1 && !visited[j]){
                help(arr,j,visited,n);
            }
        }
    }
}