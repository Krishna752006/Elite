import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        int arr[][] = new int[m][n];
        int mat[] = new int[n];
        for(int i  = 0;i<m;i++){
            for(int j = 0;j<n;j++){
                arr[i][j] = sc.nextInt();
                if(i==0) mat[j] = arr[0][j];
            }
        }
        boolean res = true,sw = false;
        for(int i  = 1;i<m;i++){
            if(arr[i][0] == mat[0]) sw = false;
            else sw = true;
            for(int j = 1;j<n;j++){
                if(arr[i][j] == mat[j] && !sw) continue;
                if(arr[i][j] != mat[j] && sw) continue;
                if(!sw && arr[i][j] != mat[j]){
                    res = false;
                    break;
                }
                if(sw && arr[i][j] == mat[j]){
                    res = false;
                    break;
                }
            }
        }
        System.out.print(res);
    }
}

// went from reverse and found a pattern that each row either same or inverted of each other