import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int mf = sc.nextInt();
        int maxarea = sc.nextInt();
        int arr[] = new int[n];
        for(int i = 0;i<n;i++){
            arr[i] = sc.nextInt();
        }
        Map<Integer,Integer> mp = new HashMap<>();
        int l = 0,a = 0,res = 0;
        for(int i = 0;i < n;i++){
            int v = arr[i];
            a+=v;
            mp.put(v,mp.getOrDefault(v,0)+1);
            while(a > maxarea || mp.get(v) > mf){
                if(mp.get(arr[l]) == 1) mp.remove(arr[l]);
                else mp.put(arr[l],mp.get(arr[l])-1);
                a-=arr[l++];
            }
            if(res < (i-l+1)) res = i - l + 1;
        }
        System.out.print(res);
    }
}