import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int t = sc.nextInt();
        int v = sc.nextInt();
        int arr[] = new int[n];
        for(int i = 0;i<n;i++){
            arr[i] = sc.nextInt();
        }
        int t1 = t,v1 = v,c = 0,l = 0,r = n-1;
        while(l<r){
            if(arr[l] > t1){
                t1 = t;
                c++;
            }
            t1 -= arr[l];
            l++;
            if(arr[r] > v1){
                v1 = v;
                c++;
            }
            v1 -= arr[r];
            r--;
        }
        if(l==r){
            if(t1>=v1){
                if(t1<arr[l]) c++;
            }
            else{
                if(v1<arr[r]) c++;
            }
        }
        System.out.print(c);
    }
}