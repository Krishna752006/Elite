import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int arr[][] = new int[n][3];
        for(int i = 0;i<n;i++){
            arr[i][0] = sc.nextInt();
            arr[i][1] = sc.nextInt();
            arr[i][2] = Math.abs(arr[i][0]-arr[i][1]);
        }
        Arrays.sort(arr,(a,b) -> b[2]-a[2]);
        int kmit = 0,ngit = 0, a = n/2,s = 0;
        for(int i = 0;i<n;i++){
            if(kmit<a && ngit<a){
                if(arr[i][0]<arr[i][1]){
                    s+=arr[i][0];
                    kmit++;
                }
                else{
                    s+=arr[i][1];
                    ngit++;
                }
            }
            else if(kmit == a){
                s+=arr[i][1];
                ngit++;
            }
            else if(ngit == a){
                s+=arr[i][0];
                kmit++;
            }
        }
        System.out.print(s);
    }
}